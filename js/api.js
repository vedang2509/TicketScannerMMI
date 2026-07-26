/**
 * api.js
 * Centralised API Client
 */

const API = {

    /**
     * Generic GET request
     */
    async request(params = {}) {

        const url = new URL(CONFIG.API_URL);

        Object.keys(params).forEach(key => {
            url.searchParams.append(key, params[key]);
        });

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}`
            );
        }

        return await response.json();

    },

    /**
     * QR Scanner
     */
    async scan(reference) {

        return this.request({

            reference

        });

    },

    /**
     * Dashboard Summary
     */
    async dashboard() {

        return this.request({

            action: "dashboard"

        });

    },

    /**
     * Recent Check-ins
     */
    async recent() {

        return this.request({

            action: "recent"

        });

    },

    /**
     * Search Booking
     */
    async search(query) {

        return this.request({

            action: "search",

            q: query

        });

    }

};
