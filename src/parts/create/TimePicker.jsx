import { forwardRef, useState } from 'react';
// import Input from "@/components/Input";

function TimePicker({ title, className, ...restProps }, ref) {
  const [time, setTime] = useState(null);

  return (
    <div>
      {title}
      <input
        ref={ref}
        className={className}
        type="time"
        onChange={(e) => setTime(e.target.value)}
        {...restProps}
      />
    </div>
  );
}

export default forwardRef(TimePicker);
