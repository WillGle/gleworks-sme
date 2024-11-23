import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Switch.css";

const Switch: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<{
    switchName: string;
    amount: string;
    moddingPreferences: {
      [key: string]: boolean; // Allow dynamic keys for modding preferences
    };
    springPreference: string;
    additionalNotes: string;
    termsAccepted: boolean;
  }>({
    switchName: "",
    amount: "",
    moddingPreferences: {},
    springPreference: "",
    additionalNotes: "",
    termsAccepted: false,
  });

  const [total, setTotal] = useState(0);
  const [serviceOptions, setServiceOptions] = useState<any[]>([]); // State to hold service options

  // Fetch service options when the component mounts
  useEffect(() => {
    const fetchServiceOptions = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/service-options/1`); // Adjust the ID as needed
        if (!response.ok) {
          throw new Error("Failed to fetch service options");
        }
        const data = await response.json();
        setServiceOptions(data.options); // Set the options in state

        // Initialize moddingPreferences based on fetched options
        const moddingPreferences = data.options.reduce((acc: any, option: any) => {
          acc[option.optionName.toLowerCase().replace(/\s+/g, '')] = false; // Initialize all to false
          return acc;
        }, {});
        setFormData((prev) => ({ ...prev, moddingPreferences }));
      } catch (error) {
        console.error("Error fetching service options:", error);
      }
    };

    fetchServiceOptions();
  }, []);

  useEffect(() => {
    const amount = parseInt(formData.amount) || 0;

    // Calculate the total based on selected modding preferences
    const moddingTotal = serviceOptions.reduce((total, option) => {
      if (formData.moddingPreferences[option.optionName.toLowerCase().replace(/\s+/g, '')]) {
        return total + (option.price || 0); // Add the price of the selected option
      }
      return total;
    }, 0);

    // Calculate the total based on the selected spring preference
    const springTotal = serviceOptions.reduce((total, option) => {
      if (formData.springPreference === option.optionName) {
        return total + (option.price || 0); // Add the price of the selected spring option
      }
      return total;
    }, 0);

    // Calculate the final total
    const calculatedTotal = amount * (moddingTotal + springTotal);
    setTotal(calculatedTotal);
  }, [formData, serviceOptions]); // Add serviceOptions to the dependency array

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        moddingPreferences: {
          ...prev.moddingPreferences,
          [name]: checked,
        },
        termsAccepted: checked,
      }));
    } else if (type === "radio") {
      setFormData((prev) => ({
        ...prev,
        springPreference: value as string,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const hasSelectedModdingPreference = Object.values(
      formData.moddingPreferences
    ).some((selected) => selected);

    if (
      !formData.switchName ||
      !formData.amount ||
      !hasSelectedModdingPreference ||
      !formData.termsAccepted
    ) {
      alert(
        "Please fill all required fields, select at least one modding preference, and agree to the terms."
      );
      return;
    }

    // Prepare data for session storage
    const switchModdingData = {
      switchName: formData.switchName,
      amount: parseInt(formData.amount),
      moddingPreferences: formData.moddingPreferences,
      springPreference: formData.springPreference,
      additionalNotes: formData.additionalNotes,
      termsAccepted: formData.termsAccepted,
      total: total, // Include the total cost
    };

    // Save data to session storage
    sessionStorage.setItem("switchModdingData", JSON.stringify(switchModdingData));

    alert("Order saved to session storage!");

    // Điều hướng đến trang checkout cho switch modding
    navigate("/service/switch-modding/checkout");
  };

  return (
    <div className="switch-container">
      <h1 className="switch-title">Switch Modding Service</h1>
      <form className="switch-form" onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label>Switch Name (Required)</label>
          <input
            type="text"
            name="switchName"
            value={formData.switchName}
            onChange={handleInputChange}
            className="input-field"
            placeholder="Provide the name of the switches"
            required
          />
        </div>

        <div className="form-group">
          <label>Amount (Required)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            className="input-field"
            placeholder="Enter the amount"
            required
          />
        </div>

        {/* Switch Modding Preference Section */}
        <div className="form-group">
          <label>Switch Modding Preference (ea) (Required)</label>
          <div className="form-group-note">
            Can select more than one option. Unit: each
          </div>
          <div className="checkbox-group">
            {serviceOptions
              .filter(option => option.optionGroup === "Switch Modding Preference")
              .map((option) => (
                <label key={option.id}>
                  <input
                    type="checkbox"
                    name={option.optionName.toLowerCase().replace(/\s+/g, '')}
                    checked={formData.moddingPreferences[option.optionName.toLowerCase().replace(/\s+/g, '')] || false}
                    onChange={handleInputChange}
                  />
                  {option.optionName} ({option.price} VND)
                </label>
              ))}
          </div>
        </div>

        {/* My Spring Preference Section */}
        <div className="form-group">
          <label>My Spring Preference (ea) (if you use mine)</label>
          <div className="form-group-note">
            Can select only one option. Unit: each
          </div>
          <div className="radio-group">
            {serviceOptions
              .filter(option => option.optionGroup === "My Spring Preference")
              .map((option) => (
                <label key={option.id}>
                  <input
                    type="radio"
                    name="springPreference"
                    value={option.optionName}
                    checked={formData.springPreference === option.optionName}
                    onChange={handleInputChange}
                    onDoubleClick={() =>
                      setFormData((prev) => ({ ...prev, springPreference: "" }))
                    }
                  />
                  {option.optionName} ({option.price} VND)
                </label>
              ))}
          </div>
        </div>

        <div className="form-group">
          <label>Additional Notes</label>
          <textarea
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleInputChange}
            className="input-field additional-notes"
          />
        </div>
        <div className="form-group terms-group">
          <label>
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleInputChange}
              required
            />
            I agree to the terms.
          </label>
        </div>
        <div className="total-section">
          <h2>Total</h2>
          <span>{total.toLocaleString()} VND</span>
        </div>
        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Switch;
