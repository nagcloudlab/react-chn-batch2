

import { useRef, useState } from "react";

function CustomerForm() {

    // const nameRef = useRef();
    // const emailRef = useRef();
    // const phoneRef = useRef();

    const [customer, setCustomer] = useState({
        name: "",
        email: "",
        phone: ""
    });

    const handleSubmit = (event) => {
        console.log("Form submitted");
        event.preventDefault();

        // way-1: using FormData API
        // const formData = new FormData(event.target);
        // const data = {
        //     name: formData.get("name"),
        //     email: formData.get("email"),
        //     phone: formData.get("phone")
        // };
        // console.log(data);

        // way-2: using useRef
        // const data = {
        //     name: nameRef.current.value,
        //     email: emailRef.current.value,
        //     phone: phoneRef.current.value
        // };
        // console.log(data);

        // way-3: using useState
        console.log(customer);

    }

    const handleChange = (event) => {

        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        setCustomer({
            ...customer,
            [fieldName]: fieldValue
        })
    }

    return (
        <div>
            <div>Customer Form</div>
            <hr />
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text"
                        className="form-control"
                        name="name"
                        value={customer.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email"
                        className="form-control"
                        name="email"
                        value={customer.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input type="tel"
                        className="form-control" name="phone"
                        value={customer.phone}
                        onChange={handleChange}
                        disabled={customer.email !== ""}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}


function Uncontrolled_Controlled() {
    return (
        <div>
            <h1>Uncontrolled_Controlled</h1>
            <hr />
            <CustomerForm />
        </div>
    );
}

export default Uncontrolled_Controlled;