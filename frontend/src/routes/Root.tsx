import { Outlet } from "react-router-dom";
import SideNav from "../components/SideNav";
import TopNav from "../components/TopNav";
import { useAuth } from "../hooks/useAuth";
import SignIn from "./SignIn";
import { Alert, AlertType } from "../components/Alert";
import { useEffect, useState } from "react";
import { useViewPort } from "../hooks/useViewPort";

const WINDOW_BREAKPOINT = 1024;

function Root() {
  let { user } = useAuth();
  const { width } = useViewPort();
  const { setIsSideNavOpen } = useAuth();

  const [isAlertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.WARNING);

  useEffect(() => {
    if (width < WINDOW_BREAKPOINT) setIsSideNavOpen(false);
  }, [width]);

  function showAlert(message: string, type: string) {
    setAlertMessage(message);
    setAlertType(getAlertTypeFromResponse(type));
    setAlertOpen(true);
    setTimeout(() => setAlertOpen(false), 4000);
  }

  function getAlertTypeFromResponse(success: string) {
    if (!!success) return AlertType.SUCCESS;
    else return AlertType.ERROR;
  }

  return (
    <div className="Root bg-black-500">
      {user ? (
        <>
          <SideNav />
          <TopNav />
          <Alert
            isOpen={isAlertOpen}
            message={alertMessage}
            type={alertType}
            setAlertOpen={setAlertOpen}
          />
          <div id="detail">
            <Outlet context={[showAlert]} />
          </div>
        </>
      ) : (
        <SignIn />
      )}
    </div>
  );
}

export default Root;
