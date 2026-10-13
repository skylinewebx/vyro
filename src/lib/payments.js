// Payment integration seam. VYRO ships with NO live payment processing.
// To go live: set `configured: true` and implement createCheckoutSession with your provider
// (e.g. a server endpoint that creates a hosted checkout session), then redirect to its URL.
export const payments = {
  configured: false,
  provider: null,
  async createCheckoutSession(/* { items, email } */) {
    throw new Error('No payment provider configured — this checkout is a demo.')
  },
}
