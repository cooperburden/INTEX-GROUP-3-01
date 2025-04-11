 import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// List of states for the dropdown
const states = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

// Input style for all form fields
const inputStyle = {
  padding: "1rem",
  fontSize: "1.1rem",
  borderRadius: "0.25rem",
  border: "1px solid #ccc",
  backgroundColor: "#fff",
  color: "#000",
  width: "100%", // Ensure the input takes up the full width of its container
  maxWidth: "500px", // Increase the max width for more space
  margin: "0 auto", // Center the inputs
  boxSizing: "border-box", // Include padding in width calculation
};

const CreateAccountForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <Formik
      initialValues={{
        name: "",
        phone: "",
        email: "",
        password: "",
        age: "",
        gender: "",
        city: "",
        state: "",
        zip: "",
      }}
      validationSchema={Yup.object({
        name: Yup.string().required("Name is required"),
        phone: Yup.string().required("Phone is required"),
        email: Yup.string().email("Invalid email address").required("Email is required"),
        password: Yup.string()
          .min(12, "Password must be at least 12 characters")
          .required("Password is required"),
        age: Yup.number().required("Age is required"),
        gender: Yup.string().required("Gender is required"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required"),
        zip: Yup.number().required("ZIP code is required"),
      })}
      onSubmit={async (values) => {
        setLoading(true);

        try {
          // Step 1: Register with Identity
          const registerResponse = await fetch("https://localhost:5000/api/Users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: values.email,
              password: values.password,
            }),
          });

          if (!registerResponse.ok) {
            alert("❌ Account creation failed. Please try a different email.");
            setLoading(false);
            return;
          }

          console.log("✅ Identity user registered");

          // Step 2: Add profile to movies_users
          const profileResponse = await fetch("https://localhost:5000/api/Users/AddUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...values,
              age: parseInt(values.age),
              zip: parseInt(values.zip),
              Netflix: 0,
              "Amazon Prime": 0,
              "Disney+": 0,
              "Paramount+": 0,
              Max: 0,
              Hulu: 0,
              "Apple TV+": 0,
              Peacock: 0,
            }),
          });

          if (profileResponse.ok) {
            alert("✅ Account created successfully. Please log in.");
            navigate("/login");
          } else {
            alert("⚠️ Identity created, but failed to save profile.");
          }
        } catch (error) {
          console.error("❌ Error submitting form:", error);
          alert("Something went wrong. Try again.");
        } finally {
          setLoading(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            fontSize: "1.1rem",
            alignItems: "center", // Center the entire form
            justifyContent: "center",
            minHeight: "100vh", // Ensure the form takes full height
          }}
        >
          <div>
            <Field
              type="text"
              name="name"
              placeholder="Full Name"
              required
              style={inputStyle}
            />
            <ErrorMessage name="name" component="div"  />
          </div>
          <div>
            <Field
              type="text"
              name="phone"
              placeholder="Phone"
              required
              style={inputStyle}
            />
            <ErrorMessage name="phone" component="div"  />
          </div>
          <div>
            <Field
              type="email"
              name="email"
              placeholder="Email"
              required
              style={inputStyle}
            />
            <ErrorMessage name="email" component="div"  />
          </div>
          <div>
            <Field
              type="password"
              name="password"
              placeholder="Password"
              required
              style={inputStyle}
            />
            <ErrorMessage name="password" component="div" />
          </div>
          <div>
            <Field
              type="number"
              name="age"
              placeholder="Age"
              required
              style={inputStyle}
            />
            <ErrorMessage name="age" component="div"  />
          </div>
          <div>
            <Field as="select" name="gender" required style={inputStyle}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Field>
            <ErrorMessage name="gender" component="div" />
          </div>
          <div>
            <Field
              type="text"
              name="city"
              placeholder="City"
              required
              style={inputStyle}
            />
            <ErrorMessage name="city" component="div"  />
          </div>
          <div>
            <Field
              as="select"
              name="state"
              required
              style={inputStyle}
            >
              <option value="">Select State</option>
              {states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Field>
            <ErrorMessage name="state" component="div" />
          </div>
          <div>
            <Field
              type="number"
              name="zip"
              placeholder="ZIP Code"
              required
              style={inputStyle}
            />
            <ErrorMessage name="zip" component="div" />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || loading}
            style={{
              padding: "1rem",
              backgroundColor: loading ? "#555" : "#e50914",
              color: "white",
              border: "none",
              borderRadius: "0.25rem",
              fontWeight: "600",
              fontSize: "1.1rem",
              cursor: loading || isSubmitting ? "not-allowed" : "pointer",
              transition: "background-color 0.3s",
              maxWidth: "500px", // Ensure the submit button matches the input width
              width: "100%",
              margin: "0 auto", // Center the button
            }}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default CreateAccountForm;
