import type { FieldApi } from '@tanstack/react-form'

interface ZevataSelectProps {
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
  options: Array<{ value: string; label: string }>
  placeholder?: string
  required?: boolean
  className?: string
}

export function ZevataSelect({
  field,
  label,
  options,
  placeholder = 'Select...',
  required = false,
  className = '',
}: ZevataSelectProps) {
  return (
    <div className={`md:col-span-1 ${className}`}>
      <label className="label block">
        <span className="label-text">
          {label}
          {required && ' *'}
        </span>
      </label>
      <select
        className="select select-bordered select-primary w-full"
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
