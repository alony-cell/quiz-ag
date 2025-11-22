'use client';

import { Trash2 } from 'lucide-react';
import { useTransition } from 'react';

interface DeleteQuizButtonProps {
    quizId: string;
    onDelete: (formData: FormData) => Promise<void>;
}

export default function DeleteQuizButton({ quizId, onDelete }: DeleteQuizButtonProps) {
    const [isPending, startTransition] = useTransition();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!confirm('Are you sure you want to delete this quiz?')) {
            e.preventDefault();
            return;
        }

        const formData = new FormData();
        formData.append('id', quizId);

        startTransition(async () => {
            await onDelete(formData);
        });
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={isPending}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Delete Quiz"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    );
}
