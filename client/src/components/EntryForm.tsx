// src/components/EntryForm.tsx

import { useState } from 'react';
import { useForm, useFieldArray, FieldValues } from 'react-hook-form';
import { Entry, EntryType, emptyEntry } from '../models/Entry';

interface EntryFormProps {
  initialData?: Entry;
  onSubmit: (data: Entry) => void;
  onCancel: () => void;
}

export default function EntryForm({ 
  initialData = emptyEntry, 
  onSubmit, 
  onCancel 
}: EntryFormProps) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<Entry>({
    defaultValues: initialData
  });
  
  const [isPresent, setIsPresent] = useState(!initialData.endDate);
  
  // Bullet points field array
  const bulletFieldArray = useFieldArray({
    control,
    name: "bullets" as const
  });
  
  // Keywords field array
  const keywordFieldArray = useFieldArray({
    control,
    name: "keywords" as const
  });
  
  // URLs field array
  const urlFieldArray = useFieldArray({
    control,
    name: "urls" as const
  });
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Basic Information</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            {...register("title", { required: "Title is required" })}
            className="w-full p-2 border rounded"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type *
          </label>
          <select
            {...register("type", { required: "Type is required" })}
            className="w-full p-2 border rounded"
          >
            <option value="EXPERIENCE">Experience</option>
            <option value="PROJECT">Project</option>
            <option value="EDUCATION">Education</option>
            <option value="SKILL">Skill</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organization
          </label>
          <input
            type="text"
            {...register("organization")}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            {...register("location")}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date *
            </label>
            <input
              type="date"
              {...register("startDate", { required: "Start date is required" })}
              className="w-full p-2 border rounded"
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                {...register("endDate")}
                disabled={isPresent}
                className="w-full p-2 border rounded"
              />
              <div className="flex items-center gap-1">
                <input
                  type="checkbox"
                  id="isPresent"
                  checked={isPresent}
                  onChange={(e) => setIsPresent(e.target.checked)}
                  className="h-4 w-4"
                />
                <label htmlFor="isPresent" className="text-sm">Present</label>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={3}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="highlight"
            {...register("highlight")}
            className="h-4 w-4 mr-2"
          />
          <label htmlFor="highlight" className="text-sm">
            Mark as highlight (your best work)
          </label>
        </div>
      </div>
      
      {/* Bullet Points */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Achievement Bullet Points</h2>
        
        {bulletFieldArray.fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <input
              {...register(`bullets.${index}` as const)}
              className="w-full p-2 border rounded"
              placeholder="e.g., Increased sales by 20% through..."
            />
            <button
              type="button"
              onClick={() => bulletFieldArray.remove(index)}
              className="bg-red-100 text-red-600 p-2 rounded"
            >
              Remove
            </button>
          </div>
        ))}
        
        <button
          type="button"
          onClick={() => bulletFieldArray.append("")}
          className="bg-blue-50 text-blue-600 px-3 py-2 rounded"
        >
          + Add Bullet Point
        </button>
      </div>
      
      {/* Keywords/Tags */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Keywords/Tags</h2>
        <p className="text-gray-600 text-sm">
          Add keywords to help with semantic search
        </p>
        
        <div className="flex flex-wrap gap-2 mb-2">
          {keywordFieldArray.fields.map((field, index) => (
            <div key={field.id} className="flex bg-blue-50 rounded-full overflow-hidden">
              <input
                {...register(`keywords.${index}` as const)}
                className="bg-transparent border-none px-3 py-1 outline-none"
                placeholder="keyword"
              />
              <button
                type="button"
                onClick={() => keywordFieldArray.remove(index)}
                className="bg-blue-100 text-blue-700 px-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
        <button
          type="button"
          onClick={() => keywordFieldArray.append("")}
          className="bg-blue-50 text-blue-600 px-3 py-2 rounded"
        >
          + Add Keyword
        </button>
      </div>
      
      {/* URLs */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">URLs</h2>
        
        {urlFieldArray.fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-2 gap-2">
            <input
              {...register(`urls.${index}.title` as const)}
              className="p-2 border rounded"
              placeholder="Link Title"
            />
            <div className="flex gap-2">
              <input
                {...register(`urls.${index}.url` as const)}
                className="w-full p-2 border rounded"
                placeholder="https://..."
              />
              <button
                type="button"
                onClick={() => urlFieldArray.remove(index)}
                className="bg-red-100 text-red-600 p-2 rounded"
              >
                ×
              </button>
            </div>
          </div>
        ))}
        
        <button
          type="button"
          onClick={() => urlFieldArray.append({ title: "", url: "" })}
          className="bg-blue-50 text-blue-600 px-3 py-2 rounded"
        >
          + Add URL
        </button>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save Entry
        </button>
      </div>
    </form>
  );
}