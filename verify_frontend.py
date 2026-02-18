from playwright.sync_api import sync_playwright
import time

def verify_frontend():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            # Navigate to the app
            print("Navigating to app...")
            page.goto("http://localhost:4321")

            # Wait for title
            print("Waiting for title...")
            page.wait_for_selector("text=draw2ui", timeout=10000)

            # Check Sidebar
            print("Checking Sidebar...")
            sidebar = page.locator("aside")
            if sidebar.is_visible():
                print("Sidebar visible")
            else:
                print("Sidebar not visible")

            # Check for Excalidraw
            print("Checking Excalidraw...")
            # Excalidraw takes time to load (client-only)
            # We look for the canvas or container
            # .excalidraw-container is usually present
            try:
                page.wait_for_selector(".excalidraw", timeout=15000)
                print("Excalidraw loaded")
            except Exception as e:
                print(f"Excalidraw failed to load: {e}")
                # Take screenshot for debug
                page.screenshot(path="debug_excalidraw.png")

            # Check for "Generar UI" button
            print("Checking Generate Button...")
            generate_btn = page.get_by_role("button", name="Generar UI")
            if generate_btn.is_visible():
                print("Generate button visible")
            else:
                print("Generate button not visible")

            # Take screenshot
            print("Taking screenshot...")
            page.screenshot(path="frontend_verification.png")

        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="error_screenshot.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_frontend()
