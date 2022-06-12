import { useForm, ValidationError } from '@formspree/react';
import { Button } from '@mui/material';

const Contact = () => {
    const [state, handleSubmit] = useForm("mayvkppp");
    if (state.succeeded) {
        return <p>Thanks for joining!</p>;
    }
    return (
        <>
            <form onSubmit={handleSubmit} style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "36rem",
                padding: "0 1rem",
                margin: "3rem auto 6rem",
                backgroundColor: "#fafafa",
            }}>
                <h1 style={{
                    fontSize: "2rem",
                    margin: "auto",
                    marginBottom: "1rem",
                }}>
                    Contact us
                </h1>
                <label htmlFor="full-name" style={{
                    display: "block",
                    marginBottom: "1rem",
                    fontSize: "1.5rem",
                }}>Full Name</label>
                <input
                    type="text"
                    name="name"
                    id="full-name"
                    placeholder="First and Last"
                    style={{
                        display: "block",
                        marginBottom: "1rem",
                        fontSize: "1rem",
                    }}
                    required />
                <ValidationError field="name" errors={state.errors} />
                <label htmlFor="email" style={{
                    display: "block",
                    marginBottom: "1rem",
                    fontSize: "1.5rem",
                }}>
                    Email Address
                </label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    style={{
                        display: "block",
                        marginBottom: "1rem",
                        fontSize: "1rem",
                    }}
                    required />
                <ValidationError
                    prefix="Email"
                    field="email"
                    errors={state.errors}
                />
                <label htmlFor="message" style={{
                    display: "block",
                    marginBottom: "1rem",
                    fontSize: "1.5rem",
                }}>
                    Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    style={{
                        display: "block",
                        marginBottom: "1rem",
                        fontSize: "1rem",
                    }}
                />
                <ValidationError
                    prefix="Message"
                    field="message"
                    errors={state.errors}
                />
                <Button style={{
                    display: "block",
                    margin: "auto",
                    marginBottom: "1rem",
                    fontSize: "1.25rem",
                }}
                    size={"large"} type="submit" disabled={state.submitting}>
                    Submit
                </Button>
            </form>
        </>
    );
}

export default Contact;