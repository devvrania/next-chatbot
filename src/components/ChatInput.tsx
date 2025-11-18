import { FormEvent, useState } from 'react';

interface ChatInputProps {
    onSend: (text: string) => void;
    disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
    const [value, setValue] = useState('');

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        const trimmed = value.trim();
        if (!trimmed) return;
        onSend(trimmed);
        setValue('');
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="border-t border-slate-200 p-3 flex items-center gap-2"
        >
            <textarea
                value={value}
                onChange={e => setValue(e.target.value)}
                rows={1}
                placeholder="Type your message..."
                className="flex-1 resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={disabled}
                style={{ color: "black" }}
            />
            <button
                type="submit"
                disabled={disabled || !value.trim()}
                className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
                Send
            </button>
        </form>
    );
}
