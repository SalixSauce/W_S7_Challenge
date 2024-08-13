import React, { useState } from 'react';
import * as yup from 'yup';

// Validation errors to be used with Yup
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L',
};

// Yup validation schema
const schema = yup.object().shape({
  fullName: yup.string().min(3, 'full name must be at least 3 characters').required(),
  size: yup.string().oneOf(['S', 'M', 'L'], 'size must be S or M or L').required(),
});


// Toppings data
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

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        toppings: checked
          ? [...prev.toppings, name]
          : prev.toppings.filter((topping) => topping !== name),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await schema.validate(formData, { abortEarly: false });
        setErrors({});
        
        // Determine size text
        const sizeText = formData.size === 'S' ? 'small' : formData.size === 'M' ? 'medium' : 'large';
        
        // Count toppings
        const toppingsCount = formData.toppings.length;
        const toppingsText = toppingsCount > 0 ? `with ${toppingsCount} topping${toppingsCount > 1 ? 's' : ''}` : 'with no toppings';
        
        // Set submission message
        setSubmissionMessage(`Thank you for your order, ${formData.fullName}! Your ${sizeText} pizza ${toppingsText} is on the way.`);
        
        // Clear the form after submission
        setFormData({ fullName: '', size: '', toppings: [] });
    } catch (err) {
        if (err.inner) {
            const formErrors = err.inner.reduce((acc, curr) => {
                acc[curr.path] = curr.message;
                return acc;
            }, {});
            setErrors(formErrors);
        }
    }
};


  // Determine if the form is valid
  const isFormValid = formData.fullName.length >= 3 && formData.size;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {submissionMessage && <div className="success">{submissionMessage}</div>}
      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
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
          <label htmlFor="size">Size</label><br />
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
        <label>Toppings:</label><br />
        {toppings.map((topping) => (
          <label key={topping.topping_id}>
            <input
              name={topping.text}
              type="checkbox"
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
