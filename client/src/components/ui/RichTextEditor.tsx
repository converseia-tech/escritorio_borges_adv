import { useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3,
  Quote,
  Link as LinkIcon
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  const insertLink = useCallback(() => {
    const url = prompt('Digite a URL:');
    if (url) {
      execCommand('createLink', url);
    }
  }, [execCommand]);

  return (
    <div className="rich-text-editor border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('formatBlock', '<h1>')}
          title="Título 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('formatBlock', '<h2>')}
          title="Título 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('formatBlock', '<h3>')}
          title="Título 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('bold')}
          title="Negrito"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('italic')}
          title="Itálico"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('underline')}
          title="Sublinhado"
        >
          <Underline className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('insertUnorderedList')}
          title="Lista"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('insertOrderedList')}
          title="Lista Numerada"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('formatBlock', '<blockquote>')}
          title="Citação"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={insertLink}
          title="Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        dangerouslySetInnerHTML={{ __html: value }}
        className="min-h-[400px] p-4 outline-none prose prose-lg max-w-none focus:ring-2 focus:ring-yellow-500"
        spellCheck
        style={{
          WebkitUserSelect: 'text',
          userSelect: 'text',
        }}
      />

      <style>{`
        .rich-text-editor [contenteditable] {
          font-size: 16px;
          line-height: 1.8;
        }
        
        .rich-text-editor h1 {
          font-size: 2em;
          font-weight: bold;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }
        
        .rich-text-editor h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 1.2em;
          margin-bottom: 0.4em;
        }
        
        .rich-text-editor h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 0.3em;
        }
        
        .rich-text-editor p {
          margin-bottom: 1em;
        }
        
        .rich-text-editor ul,
        .rich-text-editor ol {
          margin-bottom: 1em;
          padding-left: 1.5em;
        }
        
        .rich-text-editor li {
          margin-bottom: 0.5em;
        }
        
        .rich-text-editor blockquote {
          border-left: 4px solid #d97706;
          padding-left: 1em;
          margin: 1em 0;
          font-style: italic;
          background-color: #fef3c7;
          padding: 1em;
        }
        
        .rich-text-editor a {
          color: #2563eb;
          text-decoration: underline;
        }
        
        .rich-text-editor [contenteditable]:empty:before {
          content: attr(placeholder);
          color: #9ca3af;
          pointer-events: none;
          position: absolute;
        }
      `}</style>
    </div>
  );
}
