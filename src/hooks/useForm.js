import { useState, useEffect } from 'react';

const useForm = (initialForm, validateForm) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (typing) {
      const timer = setTimeout(() => {
        setErrors(validateForm(form));
        setTyping(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [typing, form, validateForm]);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleBlur = (event) => {
    handleChange(event);
    setTyping(true);
  };

  return {
    form,
    errors,
    handleChange,
    handleBlur,
    setForm,
  };
};

export default useForm;
