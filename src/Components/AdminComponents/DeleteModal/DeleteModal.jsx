import React from 'react';

const DeleteModal = ({ isOpen, onClose, onConfirm, title, description }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="flex flex-col max-w-md gap-2 p-6 rounded-md shadow-md bg-white text-black">
                <h2 className="flex items-center gap-2 text-xl font-semibold leading-tight tracking-wide">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-6 h-6 fill-current shrink-0 text-violet-400">
                        <path d="M451.671,348.569,408,267.945V184c0-83.813-68.187-152-152-152S104,100.187,104,184v83.945L60.329,348.568A24,24,0,0,0,81.432,384h86.944c-.241,2.636-.376,5.3-.376,8a88,88,0,0,0,176,0c0-2.7-.135-5.364-.376-8h86.944a24,24,0,0,0,21.1-35.431ZM312,392a56,56,0,1,1-111.418-8H311.418A55.85,55.85,0,0,1,312,392ZM94.863,352,136,276.055V184a120,120,0,0,1,240,0v92.055L417.137,352Z"></path>
                        <rect width="32" height="136" x="240" y="112"></rect>
                        <rect width="32" height="32" x="240" y="280"></rect>
                    </svg>
                    Are you sure to delete this {title}?
                </h2>
                <p className="flex-1 text-black ml-8">This action cannot be undone.</p>
                <div className="flex flex-col justify-end gap-3 mt-6 sm:flex-row">
                    <button 
                        className="px-6 py-2 rounded-sm bg-gray-600"
                        onClick={onClose}
                    >
                        No
                    </button>
                    <button 
                        className="px-6 py-2 rounded-sm shadow-sm bg-red-400 hover:bg-red-600  text-gray-900"
                        onClick={onConfirm}
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
