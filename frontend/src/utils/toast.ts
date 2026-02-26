import Toastify from "toastify-js";

export function showToast(
    type: "success" | "error" | "warning" | "info",
    message: string
) {
    let sign = "";
    let bgColor = "rgba(15, 23, 42, 0.95)";

    switch (type) {
        case "success":
            sign = "✨";
            bgColor = "linear-gradient(135deg, #2563eb 0%, #9333ea 100%)";
            break;
        case "error":
            sign = "🚨";
            bgColor = "linear-gradient(135deg, #e11d48 0%, #9f1239 100%)";
            break;
        case "warning":
            sign = "⚠️";
            bgColor = "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)";
            break;
        case "info":
            sign = "ℹ️";
            bgColor = "linear-gradient(135deg, #334155 0%, #1e293b 100%)";
            break;
    }

    const isSuccess = type === "success";

    Toastify({
        text: isSuccess
            ? `<span style="background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 700; display: inline-block;">${sign} ${message}</span>`
            : `${sign} ${message}`,
        duration: 3500,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        escapeMarkup: false,
        style: {
            background: isSuccess ? "#ffffff" : bgColor,
            color: isSuccess ? "inherit" : "#ffffff",
            borderRadius: "12px",
            border: isSuccess ? "1px solid #e2e8f0" : "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            fontSize: "14px",
            padding: "12px 20px",
            fontWeight: "500",
            backdropFilter: "blur(8px)",
        },
    }).showToast();
}
