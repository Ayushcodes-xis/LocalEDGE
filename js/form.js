/**
 * LocalEdge India - Form Module
 * File: 10. js/form.js
 * Description: Handles contact form validation, URL parameter pre-filling, 
 * and Formspree submission state management.
 */

const form = (() => {

  // Validation Rules
  const rules = {
    name: (val) => val.trim().length > 0,
    businessName: (val) => val.trim().length > 0,
    // Strip spaces for evaluation to allow formatted input like "+91 98765 43210"
    whatsapp: (val) => /^(\+91)?[6-9]\d{9}$/.test(val.replace(/\s+/g, '')), 
    message: (val) => val.trim().length >= 20
  };

  /**
   * Pre-fills the service select dropdown based on the ?service= URL parameter.
   */
  const prefillService = () => {
    const params = new URLSearchParams(window.location.search);
    const serviceParam = params.get('service');
    
    if (serviceParam) {
      const selectField = document.querySelector('select[name="service"]');
      if (selectField) {
        // Ensure the option exists before setting it to prevent empty blank states
        const optionExists = Array.from(selectField.options).some(opt => opt.value === serviceParam);
        if (optionExists) {
          selectField.value = serviceParam;
        }
      }
    }
  };

  /**
   * Removes the invalid state from a specific field
   */
  const clearError = (field) => {
    field.classList.remove('is-invalid');
  };

  /**
   * Adds the invalid state to a specific field
   */
  const showError = (field) => {
    field.classList.add('is-invalid');
  };

  /**
   * Handles form submission, validation, and API fetch
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formEl = e.target;
    let isValid = true;

    // Retrieve fields
    const nameField = formEl.querySelector('[name="name"]');
    const businessField = formEl.querySelector('[name="businessName"]');
    const whatsappField = formEl.querySelector('[name="whatsapp"]');
    const messageField = formEl.querySelector('[name="message"]');
    
    // Validate individual fields
    if (nameField && !rules.name(nameField.value)) {
      showError(nameField);
      isValid = false;
    }
    
    if (businessField && !rules.businessName(businessField.value)) {
      showError(businessField);
      isValid = false;
    }

    if (whatsappField && !rules.whatsapp(whatsappField.value)) {
      showError(whatsappField);
      isValid = false;
    }

    if (messageField && !rules.message(messageField.value)) {
      showError(messageField);
      isValid = false;
    }

    // Stop submission if validation fails
    if (!isValid) return;

    // Handle UI submission states
    const submitBtn = formEl.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    const successBlock = document.querySelector('.form-success');
    const errorBlock = document.querySelector('.form-error-general');
    
    // Hide general error if it was previously shown
    if (errorBlock) {
      errorBlock.style.display = 'none';
    }

    // Set "Loading" state
    submitBtn.textContent = 'Sending...';
    submitBtn.setAttribute('disabled', 'true');

    try {
      // FormData automatically captures the _gotcha honeypot field
      const formData = new FormData(formEl);
      
      const response = await fetch(formEl.action, {
        method: formEl.method,
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Success: Hide form, show success message block
        formEl.style.display = 'none';
        if (successBlock) {
          successBlock.style.display = 'block';
          
          // Focus the success message for screen readers
          successBlock.setAttribute('tabindex', '-1');
          successBlock.focus();
        }
      } else {
        // Validation failed at server or Formspree error
        if (errorBlock) errorBlock.style.display = 'block';
        submitBtn.textContent = originalBtnText;
        submitBtn.removeAttribute('disabled');
      }
    } catch (error) {
      // Network error or fetch failure
      if (errorBlock) errorBlock.style.display = 'block';
      submitBtn.textContent = originalBtnText;
      submitBtn.removeAttribute('disabled');
    }
  };

  const init = () => {
    // Target the Formspree form specifically
    const contactForm = document.querySelector('form[action^="https://formspree.io/"]');
    if (!contactForm) return;

    // Check for URL parameters
    prefillService();

    // Attach input listeners to clear errors as the user types
    const formFields = contactForm.querySelectorAll('.form-field');
    formFields.forEach(field => {
      field.addEventListener('input', () => clearError(field));
    });

    // Attach submit listener
    contactForm.addEventListener('submit', handleSubmit);
  };

  return { init };
})();
    
