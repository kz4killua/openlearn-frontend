"use client"

import { useEffect, useState } from "react"
import { type Dispatch, type SetStateAction } from "react"
import { HeaderBreadcrumbLink, Header } from "@/components/shared/header"
import { type Document, type DocumentSelection, type UserInput } from "@/types"
import { DocumentViewer } from "@/components/shared/viewer/document-viewer"
import { useDocuments } from "@/app/providers"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { BookOpenText, GraduationCap, MessageCircleQuestion } from "lucide-react"
import { toast } from "sonner"
import StyledTooltip from "@/components/shared/styled-tooltip"
import { DocumentMessages } from "@/components/documents/document-messages"
import { DocumentMessageInput } from "@/components/documents/document-message-input"


export default function DocumentViewPage({ 
  params 
} : {
  params : { id: string }
}) {

  const { documents, documentsDispatch } = useDocuments()
  const document = documents.find(item => item.id.toString() === params.id)
  const [selection, setSelection] = useState<DocumentSelection | null>(null)
  const [userInput, setUserInput] = useState<UserInput>({ 
    query: "", quote: "" 
  })
  const [sidePanelOpen, setSidePanelOpen] = useState(false)
  
  
  const headerlinks: HeaderBreadcrumbLink[] = [
    {
      name: "Documents",
      href: "/documents"
    }
  ]

  if (document) {
    headerlinks.push({
      name: document.name,
      href: `/documents/${params.id}`
    })
    headerlinks.push({
      name: "View",
      href: window.location.href
    })
  }


  return (
    <div className="flex flex-col">
      <Header links={headerlinks} />
      { document &&
        <div>
          <main>
            <ActionsMenu 
              selection={selection}  
              setUserInput={setUserInput} 
              setSidePanelOpen={setSidePanelOpen} 
            />
            <DocumentViewer 
              document={document} 
              selection={selection} 
              setSelection={setSelection} 
            />
            <SidePanel 
              sidePanelOpen={sidePanelOpen} 
              setSidePanelOpen={setSidePanelOpen} 
              document={document} userInput={userInput} 
              setUserInput={setUserInput} 
            />
          </main>
        </div>
      }
    </div>
  )
}


function SidePanel({ 
  document, sidePanelOpen, setSidePanelOpen, userInput, setUserInput
} : {
  document: Document,
  sidePanelOpen: boolean,
  setSidePanelOpen: Dispatch<SetStateAction<boolean>>,
  userInput: UserInput,
  setUserInput: Dispatch<SetStateAction<UserInput>>
}) {

  return (
    <Sheet open={sidePanelOpen} onOpenChange={(value) => setSidePanelOpen(value)} modal={false}>
      <StyledTooltip text="Ask AI">
        <SheetTrigger asChild>
          <Button variant="outline" className="fixed bottom-5 right-5 z-50 rounded-full h-auto p-3 shadow-md">
            <MessageCircleQuestion />
          </Button>
        </SheetTrigger>
      </StyledTooltip>
      <SheetContent className="flex flex-col w-full max-w-full sm:w-[500px] sm:max-w-[500px]">
        <SheetHeader>
          <SheetTitle>Chat with an AI.</SheetTitle>
        </SheetHeader>
        <DocumentMessages />
        <DocumentMessageInput document={document} userInput={userInput} setUserInput={setUserInput} />
      </SheetContent>
    </Sheet>
  )
}


function ActionsMenu({ 
  selection, setUserInput, setSidePanelOpen
} : {
  selection: DocumentSelection | null,
  setUserInput: Dispatch<SetStateAction<UserInput>>
  setSidePanelOpen: Dispatch<SetStateAction<boolean>>
}) {

  function handleExplain() {
    if (selection?.text) {
      setUserInput({
        query: "Explain this.",
        quote: selection.text
      })
      setSidePanelOpen(true)
    }
  }

  function handleDefine() {
    if (selection?.text) {
      setUserInput({
        query: "Define this.",
        quote: selection.text
      })
      setSidePanelOpen(true)
    } 
  }

  function handleQuestion() {
    if (selection?.text) {
      setUserInput({
        query: "",
        quote: selection.text
      })
      setSidePanelOpen(true)
    }
  }

  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!selection || selection.text.length === 0) {
      setOpen(false)
    } else if (selection.text.length >= 1024) {
      toast.info("To use document actions, highlight a smaller piece of text.")
      setOpen(false)
    } else {
      setOpen(true)
    }
  }, [selection])

  if (!selection) {
    return null
  }

  return (
    <DropdownMenu open={open} onOpenChange={(open) => setOpen(open)} modal={false}>
      <DropdownMenuTrigger asChild>
        <div style={{
          position: 'absolute',
          top: selection ? selection.boundingClientRect.top + window.scrollY : 0,
          left: selection ? selection.boundingClientRect.left + window.scrollX : 0,
          width: selection ? selection.boundingClientRect.width : 0,
          height: selection ? selection.boundingClientRect.height : 0
        }} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 z-40" align="start" sideOffset={10}>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleExplain} className="cursor-pointer">
            <GraduationCap className="mr-2 h-4 w-4" />
            <span>Explain</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDefine} className="cursor-pointer">
            <BookOpenText className="mr-2 h-4 w-4" />
            <span>Define</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleQuestion} className="cursor-pointer">
            <MessageCircleQuestion className="mr-2 h-4 w-4" />
            <span>Ask a question</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
