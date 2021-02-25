import React, { useRef } from "react";
import ReactDOM from "react-dom";
import { Machine } from "xstate";
import { useMachine } from "@xstate/react";
import machineConfig from "./SignIn/machineConfig";
import initMachineOptions from "./SignIn/initMachineOptions";
import { defer } from "lodash";
import { Layout, Button, Typography, Row, Col } from "antd";
import "antd/dist/antd.css";
import { Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
const { Text, Link, Title } = Typography;
const SignInForm = () => {
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const submitButtonnRef = useRef(null);

  const handleEmailInputFocus = () => {
    // using defer as workaround as body element was being focused instead of input element
    defer(() => {
      emailInputRef.current.focus();
    });
  };

  const handlePasswordInputFocus = () => {
    defer(() => {
      passwordInputRef.current.focus();
    });
  };

  const handleSubmitButtonFocus = () => {
    defer(() => {
      submitButtonnRef.current.focus();
    });
  };

  const machineOptions = initMachineOptions(
    handleEmailInputFocus,
    handlePasswordInputFocus,
    handleSubmitButtonFocus
  );
  const signInMachine = Machine(machineConfig, machineOptions);
  const [current, send] = useMachine(signInMachine);

  const handleEmailChange = (e) => {
    send({
      type: "INPUT_EMAIL",
      email: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    send({
      type: "INPUT_PASSWORD",
      password: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    send({ type: "SUBMIT" });
  };

  const handleCancel = (e) => {
    send({ type: "CANCEL" });
  };

  return (
    <div style={{ padding: "20vh 0 0 15vw" }}>
      <Col>
        <Row>
          <Col span={5}>
            <p>Username: developer@developer.com</p>
          </Col>
        </Row>
        <Row>
          <Col span={5}>
            <p>Password: admin</p>
          </Col>
        </Row>
        <Row>
          <Col span={5}>
            <Title>Sign in</Title>
          </Col>
        </Row>
        <Row>
          <Col span={5}>
            <Text type="strong">Email *</Text>
          </Col>
        </Row>
        <Row>
          <Col span={5}>
            <Input
              name="email"
              id="email"
              value={current.context.email}
              ref={emailInputRef}
              onChange={handleEmailChange}
              isRequired
              disabled={current.matches("waitingResponse")}
              autoFocus
              prefix={<UserOutlined />}
            />
          </Col>
        </Row>
        <Row>
          <Col span={5}>
            {current.matches("ready.email.error") ? (
              <Text type="danger">
                {current.matches("ready.email.error.empty") &&
                  "Please enter your email"}
                {current.matches("ready.email.error.badFormat") &&
                  "Email format doesn't look right"}
                {current.matches("ready.email.error.noAccount") &&
                  "No account linked with this email"}
              </Text>
            ) : (
              <br />
            )}
          </Col>
        </Row>
        <Row>
          <Col span={5}>
            <Text type="strong">Password *</Text>
          </Col>
        </Row>
        <Row>
          <Col span={5}>
            <Input
              id="password"
              name="password"
              label="Password"
              type="password"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              ref={passwordInputRef}
              value={current.context.password}
              disabled={current.matches("waitingResponse")}
              onChange={handlePasswordChange}
              isRequired
            />
          </Col>
        </Row>
        <Row>
          <Col span={5}>
            {current.matches("ready.password.error") ? (
              <Text type="danger">
                {current.matches("ready.password.error.empty") &&
                  "Please enter your password"}
                {current.matches("ready.password.error.tooShort") &&
                  "Password should be at least 5 characters"}
                {current.matches("ready.password.error.incorrect") &&
                  "Incorrect password"}
              </Text>
            ) : (
              <br />
            )}
          </Col>
        </Row>
        <Row>
          <Col span={5}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              isLoading={current.matches("waitingResponse")}
              ref={submitButtonnRef}
            >
              Sign in
            </Button>
          </Col>
        </Row>
      </Col>
    </div>
  );
};

ReactDOM.render(<SignInForm />, document.getElementById("root"));
