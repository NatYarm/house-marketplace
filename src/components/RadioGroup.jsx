import { Controller } from 'react-hook-form';

const RadioGroup = ({ control, name }) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <>
          <input
            type="radio"
            checked={value === true}
            label="Yes"
            onChange={() => onChange(true)}
          />

          <input
            type="radio"
            checked={value === false}
            label="No"
            onChange={() => onChange(false)}
          />
        </>
      )}
    />
  );
};

export default RadioGroup;
