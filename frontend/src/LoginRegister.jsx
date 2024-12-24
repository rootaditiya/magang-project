import { Button, Card, CardBody, Input, Tab, Tabs } from "@nextui-org/react";
import { useState } from "react";
import { Link } from "react-router";
import Logo from "/logo.ico";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const LoginRegister = () => {
  const [selected, setSelected] = useState("login");

  return (
    <div className="flex flex-col w-full h-full justify-center items-center p-10">
      <Card className="max-w-full w-[400px] p-5">
        <FontAwesomeIcon icon={faArrowLeft} className={`self-start text-2xl font-medium mb-5`}/>

        <div className="logo self-center mb-10">
          <img src={Logo} alt="" className={``} />
        </div>

        <div className="flex flex-col title self-center text-center mb-5 items-center justify-center gap-5">
          {selected === "login" ? (
            <>
              <h2 className={`text-2xl`}>Masuk ke Asnesia</h2>
              <p className={`w-4/5`}>Gunakan akun Appskep untuk melanjutkan ke Appskep CPNS</p>
            </>
          ) : (
            <>
              <h2>Daftar ke Asnesia</h2>
              <p className={`w-4/5`}>Buat akun Appskep untuk melanjutkan ke Appskep CPNS</p>
            </>
          )}
        </div>
        <CardBody className="overflow-hidden">
          <Tabs
            fullWidth
            aria-label="Tabs form"
            selectedKey={selected}
            size="md"
            onSelectionChange={setSelected}
          >
            <Tab key="login" title="Login">
              <form className="flex flex-col gap-4">
                <Input
                  isRequired
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                />
                <Input
                  isRequired
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                />
                <p className="text-center text-small">
                  Need to create an account?{" "}
                  <Link size="sm" onPress={() => setSelected("sign-up")}>
                    Sign up
                  </Link>
                </p>
                <div className="flex gap-2 justify-end">
                  <Button fullWidth color="primary">
                    Login
                  </Button>
                </div>
              </form>
            </Tab>
            <Tab key="sign-up" title="Sign up">
              <form className="flex flex-col gap-4 h-[300px]">
                <Input
                  isRequired
                  label="Name"
                  placeholder="Enter your name"
                  type="text"
                />
                <Input
                  isRequired
                  label="Phone Number"
                  placeholder="ex: 08xxxxxxxxxx"
                  type="text"
                />
                <Input
                  isRequired
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                />
                <Input
                  isRequired
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                />
                <p className="text-center text-small">
                  Already have an account?{" "}
                  <Link size="sm" onPress={() => setSelected("login")}>
                    Login
                  </Link>
                </p>
                <div className="flex gap-2 justify-end">
                  <Button fullWidth color="primary">
                    Sign up
                  </Button>
                </div>
              </form>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
};

export default LoginRegister;
