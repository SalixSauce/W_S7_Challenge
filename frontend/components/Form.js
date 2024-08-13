import React, { useState, useEffect, useCallback } from 'react';
import * as yup from 'yup';


const schema = yup.object().shape({
  fullName: yup
    .string()
    .trim() 
    .min(3, 'full name must be at least 3 characters')
    .max(20, 'Full name must be at most 20 characters')
    .required('Full name is required'),
  size: yup
    .string()
    .oneOf(['S', 'M', 'L'], 'Size must be S or M or L')
    .required('Size is required'),
});

const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
];

export default function Form() {
  const [formData, setFormData] = useState({
    fullName: '',
    size: '',
    toppings: [],
  });

  const [errors, setErrors] = useState({});
  const [submissionMessage, setSubmissionMessage] = useState('');


  const validateData = async (data) => {
    try {
      await schema.validate(data, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const formErrors = err.inner.reduce((acc, curr) => {
        acc[curr.path] = curr.message;
        return acc;
      }, {});
      setErrors(formErrors);
      return false;
    }
  };


  useEffect(() => {
    validateData(formData);
  }, [formData]);

  const handleChange = useCallback((e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
            ? [...prev.toppings, value]
            : prev.toppings.filter((topping) => topping !== value)
          : value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const isValid = await validateData(formData);
      if (!isValid) return;

     
      const sizeText = formData.size === 'S' ? 'small' : formData.size === 'M' ? 'medium' : 'large';

      
      const toppingsCount = formData.toppings.length;
      const toppingsText =
        toppingsCount > 0
          ? `with ${toppingsCount} topping${toppingsCount > 1 ? 's' : ''}`
          : 'with no toppings';

     
      setSubmissionMessage(
        `Thank you for your order, ${formData.fullName.trim()}! Your ${sizeText} pizza ${toppingsText} is on the way.`
      );

     
      setFormData({ fullName: '', size: '', toppings: [] });
    },
    [formData]
  );


  const isFormValid = !Object.keys(errors).length && formData.fullName.trim() && formData.size;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {submissionMessage && <div className="success">{submissionMessage}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label>
          <br />
          <input
            placeholder="Type full name"
            id="fullName"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>
        {errors.fullName && <div className="error">{errors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label>
          <br />
          <select id="size" name="size" value={formData.size} onChange={handleChange}>
            <option value="">----Choose Size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
        {errors.size && <div className="error">{errors.size}</div>}
      </div>

      <div className="input-group">
        <label>Toppings:</label>
        <br />
        {toppings.map((topping) => (
          <label key={topping.topping_id}>
            <input
              name="toppings"
              type="checkbox"
              value={topping.text}
              checked={formData.toppings.includes(topping.text)}
              onChange={handleChange}
            />
            {topping.text}
            <br />
          </label>
        ))}
      </div>

      <input type="submit" disabled={!isFormValid} value="Submit" />
    </form>
  );
}
