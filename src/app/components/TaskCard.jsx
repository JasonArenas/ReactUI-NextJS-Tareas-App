"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function TaskCard({ task }) {
    const router = useRouter()
    const [edit, setEdit] = useState(false)

    const [NewTitle, setNewTitle] = useState(task.title);
    const [NewDescription, setNewDescription] = useState(task.description)

    const handleDelete = async(id) => {
        if(window.confirm('Quieres eliminar esta tarea?')) {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${id}`, {
                method: "DELETE",
            });
            if( res.status === 204) {
                router.refresh()
            }
        }
    }

    const handleTaskDone = async(id) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${id}/done/`, {
            method: "POST",
        });

        if(res.status === 200) {
            router.refresh()
        }
    }

    const handleUpdate = async(id) => {
        console.log(id);
        console.log(NewTitle, NewDescription)
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${id}/`,
        {
            method: "PUT",
            body: JSON.stringify({ title: NewTitle, description: NewDescription }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await res.json();
        setNewTitle(data.title);
        setNewDescription(data.description);

        setEdit(false);
    }

    return (
        <div
            className="bg-slate-500 px-4 py-3 mb-2 rounded-md text-slate-200 flex justify-between item-center"
        >
            <div className='flex flex-col'>

                {
                    !edit ? (
                        <h2 className="font-bold">
                            {NewTitle}
                            {task.done && <span>✅</span>}
                        </h2>
                    )
                    : (
                        <input type='text' placeholder={task.title} className='p-2 bg-slate-500 border-none outline-none
                        text-green-400'
                        onChange={e => setNewTitle(e.target.value)}
                        />
                )}

                {
                    !edit ? (
                        <p>{task.description}</p>
                    ) : (
                        <textarea 
                            placeholder={NewDescription} 
                            className='p-2 bg-slate-500 border-none outline-none text-green-400 w-full'
                            rows={1}
                            onChange={e => setNewDescription(e.target.value)}
                        />
                    )
                }
            </div>
            <div className="flex justify-between gap-x-2">
                {edit && (
                    <button 
                        className='bg-slate-300 text-black rounded-md p2'
                        onClick={() => handleUpdate(task.id)}
                    >
                        Guardar Cambios
                    </button>
                    )
                }

                <button
                    className= {
                        "text-white rounded-md p-2" + (task.done ? " bg-gray-700" : " bg-green-500")
                    }
                    onClick={() => handleTaskDone(task.id)}
                >
                    {task.done ? "Desmarcar" : "Marcar"}
                </button>
                <button
                    className="bg-red-500 text-white rounded-md p-2"
                    onClick={() => handleDelete(task.id)}
                >Eliminar</button>
                <button
                    className="bg-indigo-500 text-white rounded-md p-2"
                    onClick={() => setEdit(!edit)}
                >Editar</button>
            </div>
        </div>
    )
}