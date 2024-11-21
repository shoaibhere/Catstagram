import FloatingShape from "./floatingShape";
import SignUpPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
function CreateAcc() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center relative overflow-hidden">
      <FloatingShape
        color="bg-pink-300"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-pink-200"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-pink-400"
        size="w-32 h-32"
        top="40%"
        left="10%"
        delay={2}
      />

      {/* <Routes>
        <Route path="/" element={"Home"} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes> */}
    </div>
  );
}

export default CreateAcc;
