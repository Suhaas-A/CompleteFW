import { useState } from "react";
import { sendResetOtp, resetPassword } from "../api/authApi";
import { useTheme } from "../contexts/ThemeContext";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const { dark } = useTheme();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSendOtp(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await sendResetOtp(email);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await resetPassword(email, otp, newPassword);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300
        ${dark ? "bg-[#0B0C0E] text-white" : "bg-gray-100 text-gray-900"}`}
    >
      <div
        className={`w-full max-w-sm rounded-2xl border p-6 transition-colors duration-300
          ${dark
            ? "bg-[#131417] border-[#232323]"
            : "bg-white border-gray-200 shadow-sm"}`}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold">
            {step === 1 && "Forgot Password"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "Success"}
          </h1>
          <p
            className={`mt-2 text-sm ${
              dark ? "text-[#A1A1AA]" : "text-gray-600"
            }`}
          >
            {step === 1 && "We’ll send an OTP to your email"}
            {step === 2 && "Enter the OTP and new password"}
            {step === 3 && "Your password has been reset"}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-md bg-red-500/10 text-red-500 px-3 py-2 text-sm">
            {error}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className={`w-full rounded-lg px-3 py-2 text-sm outline-none transition
                ${dark
                  ? "bg-[#0F1012] border border-[#232323] focus:border-[#D4AF37]"
                  : "bg-gray-50 border border-gray-300 focus:border-[#D4AF37]"}`}
            />

            <button
              disabled={loading}
              className="w-full rounded-lg bg-[#D4AF37] py-2.5 text-black font-medium hover:brightness-110 transition disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              type="text"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="OTP"
              className={`w-full rounded-lg px-3 py-2 text-sm outline-none transition
                ${dark
                  ? "bg-[#0F1012] border border-[#232323] focus:border-[#D4AF37]"
                  : "bg-gray-50 border border-gray-300 focus:border-[#D4AF37]"}`}
            />

            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className={`w-full rounded-lg px-3 py-2 text-sm outline-none transition
                ${dark
                  ? "bg-[#0F1012] border border-[#232323] focus:border-[#D4AF37]"
                  : "bg-gray-50 border border-gray-300 focus:border-[#D4AF37]"}`}
            />

            <button
              disabled={loading}
              className="w-full rounded-lg bg-[#D4AF37] py-2.5 text-black font-medium hover:brightness-110 transition disabled:opacity-60"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="text-center space-y-4">
            <p className="text-[#D4AF37] font-medium">
              Password reset successful
            </p>
            <Link
              to="/login"
              className="block w-full rounded-lg bg-[#D4AF37] py-2.5 text-black font-medium text-center hover:brightness-110 transition"
            >
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
