/**
 * Snackbar Notification System
 * Modern, non-intrusive notification manager
 */
(function () {
    'use strict';

    class SnackbarManager {
        constructor() {
            this.container = null;
            this.snackbars = [];
            if (document.body) {
                this.init();
            } else {
                window.addEventListener('DOMContentLoaded', () => this.init());
            }
        }

        init() {
            // Create container if it doesn't exist
            if (!this.container) {
                this.container = document.createElement('div');
                this.container.className = 'snackbar-container';
                document.body.appendChild(this.container);
            }
        }

        /**
         * Show a snackbar notification
         * @param {string} message - Message to display
         * @param {string} type - Type: 'success', 'error', 'warning', 'info'
         * @param {number} duration - Duration in milliseconds (0 = no auto-dismiss)
         */
        show(message, type = 'info', duration = 3000) {
            const snackbar = this.createSnackbar(message, type, duration);
            this.container.appendChild(snackbar);
            this.snackbars.push(snackbar);

            // Auto-dismiss if duration > 0
            if (duration > 0) {
                setTimeout(() => {
                    this.dismiss(snackbar);
                }, duration);
            }

            return snackbar;
        }

        createSnackbar(message, type, duration) {
            const snackbar = document.createElement('div');
            snackbar.className = `snackbar ${type}`;

            // Icon based on type
            const icons = {
                success: 'fa-check-circle',
                error: 'fa-times-circle',
                warning: 'fa-exclamation-triangle',
                info: 'fa-info-circle'
            };

            snackbar.innerHTML = `
                <i class="fas ${icons[type] || icons.info} snackbar-icon"></i>
                <div class="snackbar-message">${message}</div>
                <button class="snackbar-close" aria-label="Close">
                    <i class="fas fa-times"></i>
                </button>
                ${duration > 0 ? `<div class="snackbar-progress" style="animation-duration: ${duration}ms;"></div>` : ''}
            `;

            // Close button handler
            const closeBtn = snackbar.querySelector('.snackbar-close');
            closeBtn.addEventListener('click', () => {
                this.dismiss(snackbar);
            });

            return snackbar;
        }

        dismiss(snackbar) {
            if (!snackbar || !snackbar.parentElement) return;

            snackbar.classList.add('removing');

            // Remove after animation
            setTimeout(() => {
                if (snackbar.parentElement) {
                    snackbar.parentElement.removeChild(snackbar);
                }
                const index = this.snackbars.indexOf(snackbar);
                if (index > -1) {
                    this.snackbars.splice(index, 1);
                }
            }, 300);
        }

        // Convenience methods
        success(message, duration = 3000) {
            return this.show(message, 'success', duration);
        }

        error(message, duration = 4000) {
            return this.show(message, 'error', duration);
        }

        warning(message, duration = 3500) {
            return this.show(message, 'warning', duration);
        }

        info(message, duration = 3000) {
            return this.show(message, 'info', duration);
        }

        // Clear all snackbars
        clearAll() {
            this.snackbars.forEach(snackbar => {
                this.dismiss(snackbar);
            });
        }
    }

    // Create global instance
    window.Snackbar = new SnackbarManager();

    // Backward compatibility - map old showToast to new Snackbar
    window.showToast = function (message, type = 'success') {
        if (type === 'error') {
            window.Snackbar.error(message);
        } else {
            window.Snackbar.success(message);
        }
    };
})();
