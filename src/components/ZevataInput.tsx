import type { FieldApi } from '@tanstack/react-form'

interface ZevataInputProps {
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
  type?: 'text' | 'date' | 'time' | 'url' | 'email' | 'tel'
  placeholder?: string
  required?: boolean
  className?: string
}

export function ZevataInput({
  field,
  label,
  type = 'text',
  placeholder,
  required = false,
  className = '',
}: ZevataInputProps) {
  const id = `input-${Math.random().toString(36).substring(2, 9)}`
  return (
    <div className={className || 'md:col-span-1'}>
      <label className="label block" htmlFor={id}>
        <span className="label-text">
          {label}
          {required && ' *'}
        </span>
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="input input-bordered w-full input-primary"
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
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
