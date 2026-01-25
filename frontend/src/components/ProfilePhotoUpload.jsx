import React, { useRef } from 'react';

const MAX_SIZE_KB = 200;
const ACCEPT = 'image/jpeg,image/png,image/webp';

const ProfilePhotoUpload = ({ profilePhoto, name, onUpdate, disabled }) => {
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image (JPEG, PNG, or WebP).');
      return;
    }
    if (file.size > MAX_SIZE_KB * 1024) {
      alert(`Image must be under ${MAX_SIZE_KB} KB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onUpdate(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const initial = name ? name.trim().charAt(0).toUpperCase() : '?';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-3xl font-bold shadow-md ring-2 ring-amber-200">
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            initial
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <label className="cursor-pointer">
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className="sr-only"
            onChange={handleFile}
            disabled={disabled}
          />
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 border-amber-300 text-amber-700 hover:bg-amber-50 transition-colors">
            {profilePhoto ? 'Update profile photo' : 'Add profile photo'}
          </span>
        </label>
        {profilePhoto && (
          <button
            type="button"
            onClick={() => onUpdate(null)}
            disabled={disabled}
            className="px-4 py-2 rounded-xl text-sm font-semibold border border-stone-300 text-stone-600 hover:bg-stone-100 transition-colors"
          >
            Remove photo
          </button>
        )}
      </div>
      <p className="text-xs text-stone-500">JPEG, PNG or WebP. Max {MAX_SIZE_KB} KB.</p>
    </div>
  );
};

export default ProfilePhotoUpload;
