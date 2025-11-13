import type { FieldApi } from '@tanstack/react-form'

interface ZevataTextAreaProps {
  field: FieldApi<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >
  label: string
  placeholder?: string
  required?: boolean
  className?: string
  rows?: number
}

export function ZevataTextArea({
  field,
  label,
  placeholder,
  required = false,
  className = '',
  rows = 4,
}: ZevataTextAreaProps) {
  const id = `textarea-${Math.random().toString(36).substring(2, 9)}`
  return (
    <div className={`md:col-span-2 ${className}`}>
      <label className="label block" htmlFor={id}>
        <span className="label-text">
          {label}
          {required && ' *'}
        </span>
      </label>
      <textarea
        id={id}
        placeholder={placeholder}
        className="textarea textarea-bordered w-full textarea-primary"
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        rows={rows}
      />
      {field.state.meta.errors.length > 0 && (
        <label className="label block">
          <span className="label-text-alt text-error">
            {field.state.meta.errors.join(', ')}
          </span>
        </label>
      )}
    </div>
  )
}
