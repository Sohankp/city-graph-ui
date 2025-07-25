import React, { useState } from 'react';
import { Upload, Image, CheckCircle, AlertCircle } from 'lucide-react';

const EventUpload: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [dragActive, setDragActive] = useState(false);

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newImages = Array.from(files).filter(file =>
        file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
      );
      setImages(prev => [...prev, ...newImages].slice(0, 5));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) return;

    setIsSubmitting(true);
    try {
      const base64Images = await Promise.all(images.map(file => toBase64(file)));
      const timestamp = new Date().toISOString();

      const payloads = base64Images.map(image_b64 => ({
        image_b64,
        image_description: description,
        location,
        tags,
        timestamp
      }));

      console.log('Payload to send:', payloads);
      // Simulate API call
      setTimeout(() => {
        setSubmitStatus('success');
        setIsSubmitting(false);
        setImages([]);
        setDescription('');
        setLocation('');
        setTags([]);
        setCurrentTag('');
        setTimeout(() => setSubmitStatus('idle'), 3000);
      }, 2000);
    } catch (error) {
      console.error('Error converting to base64', error);
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="p-6 flex items-center justify-center min-h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircle className="text-emerald-600" size={32} />
          </div>
          <h3 className="text-xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">Event Submitted Successfully!</h3>
          <p className="text-slate-600 mb-6">Your event has been submitted.</p>
          <button
            onClick={() => setSubmitStatus('idle')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Submit Another Event
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 min-h-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent mb-2">Upload Event</h2>
        <p className="text-slate-600">Upload images related to the event with details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Description, Location */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Image Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-white/70 backdrop-blur-sm transition-all duration-200"
              placeholder="Describe the images"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-white/70 backdrop-blur-sm transition-all duration-200"
              placeholder="Enter location"
            />
          </div>

        {/* Tags */}
        {/* <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6"> */}
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Tags</h3>
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={currentTag}
              onChange={e => setCurrentTag(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="flex-1 border border-slate-300 rounded-xl px-3 py-2 bg-white/70 backdrop-blur-sm transition-all duration-200"
              placeholder="Add tags"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Add
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span key={tag} className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center border border-blue-200 shadow-sm">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        {/* </div> */}

        {/* Images */}
        {/* <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6"> */}
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Images</h3>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50' : 'border-slate-300 bg-white/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Image className="mx-auto text-slate-400 mb-2" size={32} />
            <p className="text-slate-600 mb-2">Drag and drop images here, or click to select</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={e => handleImageUpload(e.target.files)}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 cursor-pointer inline-block shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Select Images
            </label>
            <p className="text-xs text-slate-500 mt-2">Max 5 images, 5MB each</p>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-24 object-cover rounded-xl shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:from-red-600 hover:to-red-700 shadow-lg transition-all duration-200 transform hover:scale-110"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        {/* </div> */}

        {/* Submit */}
        {/* <div className="flex justify-end"> */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Upload size={16} className="mr-2" />
                Submit Event
              </>
            )}
          </button>
        {/* </div> */}
        </div>

        {/* Info Notice */}
      </form>
    </div>
  );
};

export default EventUpload;
