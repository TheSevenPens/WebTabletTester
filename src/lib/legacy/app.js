import { registerWindowLoadEventListeners } from './app_pointer.js';
import { updateProcessingSettingsFromUx, uxProcessingSettings } from './app_ux_processing_settings.js';
import { updateFormatSettingsFromUx } from './app_ux_format_settings.js';
import { clearCanvas } from './draw.js';
import { setCanvasProps } from './app_canvas.js';

export const appSettings = {
  canvasColor: "rgba(230, 230, 250, 1.0)",
  downloadFilename: "TabletTester_Untitled",
};

export function initPage() {
  setCanvasProps();
}

export function toggleSmoothingSettings() {
  const flyout = document.getElementById("smoothingFlyout");
  flyout.style.display = flyout.style.display === "none" ? "block" : "none";
}

export function toggleStrokeStatsVisibility() {
  const checkbox = /** @type {HTMLInputElement} */ (document.getElementById("toggleStrokeStatsCheckbox"));
  const strokeStatsPanel = document.getElementById("strokeStatsPanel");
  if (strokeStatsPanel && checkbox) {
    strokeStatsPanel.style.display = checkbox.checked ? "block" : "none";
  }
}

export function resetAdvancedSettings() {
  /** @type {HTMLInputElement} */ (uxProcessingSettings.pressureSmoothingSlider).value = "0.0";
  /** @type {HTMLInputElement} */ (uxProcessingSettings.pressureCurveAmountSlider).value = "0.0";
  /** @type {HTMLInputElement} */ (uxProcessingSettings.positionSmoothingSlider).value = "0.0";
  /** @type {HTMLSelectElement} */ (uxProcessingSettings.pressureQuantizationDropdown).value = "0";
  /** @type {HTMLInputElement} */ (uxProcessingSettings.tiltSmoothingSlider).value = "0.0";
  updateSettingsFromUx();
}

export function registerEventHandlers() {
  window.addEventListener("load", registerWindowLoadEventListeners, true);
  registerDocumentHotkeyEventListeners();
}

export function registerDocumentHotkeyEventListeners() {
  // Hotkey for DELETE or BACKSPACE
  document.addEventListener("keydown", (e) => {
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault(); // Prevent browser back navigation
      clearCanvas();
    }
  });
}

// Close flyout when clicking outside
document.addEventListener('click', function (event) {
  const smoothingFlyout = document.getElementById("smoothingFlyout");
  const smoothingButton = document.getElementById("smoothingButton");

  /** @type {Node} */
  const targetNode = /** @type {Node} */ (event.target);

  if (smoothingFlyout && smoothingButton &&
    !smoothingFlyout.contains(targetNode) &&
    !smoothingButton.contains(targetNode) &&
    smoothingFlyout.style.display !== "none") {
    smoothingFlyout.style.display = "none";
  }
});

export function updateSettingsFromUx() {
  updateFormatSettingsFromUx();
  updateProcessingSettingsFromUx();
}

// Svelte will trigger these during its onMount lifecycle
// updateSettingsFromUx();
// registerEventHandlers();
