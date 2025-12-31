This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.






# Dashboard Demo Walkthrough Guide
## Complete Guide for Presenting Pub/Sub Monitoring Dashboards

================================================================================
OVERVIEW
================================================================================

This guide helps you present your Pub/Sub monitoring dashboards effectively.
It includes:
- Opening script
- Step-by-step walkthrough for each metric
- Why each metric matters
- Why each aggregation is used
- Anticipated questions and answers
- Presentation tips

================================================================================
PART 1: PRE-DEMO PREPARATION
================================================================================

## Before the Demo

1. **Test Your Dashboards**
   - Verify all 7 metrics are displaying data
   - Check that filters work correctly
   - Ensure auto-refresh is enabled
   - Test with different time ranges

2. **Prepare Your Environment**
   - Have dashboards open and ready
   - Close unnecessary tabs
   - Have this guide open in another tab
   - Test screen sharing if remote

3. **Know Your Audience**
   - Technical team? Focus on aggregations and queries
   - Management? Focus on business impact and alerts
   - Mixed? Start high-level, dive deep when asked

================================================================================
PART 2: OPENING SCRIPT
================================================================================

## Opening Statement (30 seconds)

**"Good [morning/afternoon], everyone. Today I'll walk you through our consolidated Pub/Sub monitoring dashboard.**

**We've created a unified dashboard that monitors all 7 core metrics across all our Pub/Sub services. This gives us a single place to see the health of our message processing system.**

**The key improvement is that we've normalized these metrics so we can compare services regardless of their scale - whether they process tens, thousands, or millions of messages.**

**Let me show you what we're monitoring and why each metric matters."**

---

## Transition to Dashboard

**"Let me open the dashboard and walk you through each section..."**

================================================================================
PART 3: WALKTHROUGH - METRIC BY METRIC
================================================================================

## SECTION 1: MESSAGE THROUGHPUT

### Opening for This Section

**"The first section shows message throughput - how many messages are being processed."**

---

### METRIC 1: ACK MESSAGE COUNT

**What to Show:**
- Point to the chart showing Ack Msg Count
- Show different subscription lines on the chart

**What to Say:**

**"This first metric shows 'Acknowledged Message Count' - this is our primary throughput indicator."**

**"It tells us how many messages per second are being successfully processed by our consumers."**

**"Why we need this:**
- **It shows if our consumers are actively working**
- **It helps us detect if processing has stopped or slowed down**
- **It's essential for measuring our processing rate against SLAs**
- **If this drops to zero, all consumers are down - that's critical"**

**"Why this aggregation:**
- **We use `sum by (subscription_id)(rate(...))` because:**
  - **`rate()` converts the count into messages per second - this is more meaningful than raw counts**
  - **`sum by (subscription_id)` groups by each subscription so we can see each service separately**
  - **This lets us compare throughput across different services"**

**"What you're looking at:**
- **Each line represents a different subscription**
- **The Y-axis shows messages per second**
- **If a line drops suddenly, that service has a problem**
- **If a line goes to zero, that consumer is completely down"**

---

### METRIC 2: UNACK MESSAGE COUNT

**What to Show:**
- Point to the UnAck Msg Count chart
- Highlight the logarithmic scale on Y-axis
- Show how different services are visible

**What to Say:**

**"This second metric shows 'Unacknowledged Message Count' - this is our backlog indicator."**

**"It tells us how many messages are waiting to be processed."**

**"Why we need this:**
- **It shows if consumers are falling behind publishers**
- **A rising count means consumers can't keep up**
- **This is critical for detecting processing lag**
- **If this grows continuously, we need to scale consumers"**

**"Why this aggregation:**
- **We use `sum by (subscription_id)(...)` - no rate() because this is an absolute count**
- **We're summing the total unacknowledged messages per subscription"**

**"Why logarithmic scale:**
- **This is CRITICAL - notice the Y-axis uses logarithmic scale**
- **Some services have tens of messages, others have thousands, some have millions**
- **Without logarithmic scale, services with millions would dominate the chart**
- **With logarithmic scale, we can see spikes for ANY service, regardless of volume"**

**"What you're looking at:**
- **Each line is a different subscription**
- **The Y-axis is logarithmic - so a small change is visible even for large services**
- **If a line spikes upward, that service's backlog is growing - investigate immediately"**
- **If a line stays flat at zero, that service is keeping up perfectly"**

---

## SECTION 2: LATENCY MONITORING

### Opening for This Section

**"The second section shows latency - how long it takes to process and publish messages."**

---

### METRIC 3: ACK LATENCIES

**What to Show:**
- Point to the Ack Latencies chart
- Show p95 percentile values
- Explain what p95 means

**What to Say:**

**"This metric shows 'Acknowledgment Latencies' - how long it takes consumers to process messages."**

**"Why we need this:**
- **It shows consumer performance - are they processing fast enough?**
- **High latency means slow processing, which affects user experience**
- **It's critical for meeting our processing time SLAs**
- **If latency spikes, consumers are struggling - may need optimization or scaling"**

**"Why this aggregation:**
- **We use `histogram_quantile(0.95, ...)` which gives us the 95th percentile**
- **Why p95? Because it shows the latency for 95% of messages - this is more meaningful than average**
- **Average can hide outliers - p95 shows what most users experience**
- **We group by subscription_id so we can see latency per service"**

**"What you're looking at:**
- **Each line is a different subscription**
- **The Y-axis shows latency in seconds**
- **If a line spikes upward, that service is processing slowly - investigate**
- **If latency is consistently high, we may need to optimize the consumer code"**

---

### METRIC 4: PUBLISH REQUEST LATENCIES

**What to Show:**
- Point to the Publish Latencies chart
- Note that this uses topic_id, not subscription_id

**What to Say:**

**"This metric shows 'Publish Request Latencies' - how long it takes to publish messages to Pub/Sub."**

**"Why we need this:**
- **It shows publisher performance - are publishers experiencing delays?**
- **High latency here means publishers are slow - could be network or Pub/Sub service issues**
- **It's important for end-to-end latency - affects total message delivery time"**

**"Why this aggregation:**
- **Same as Ack Latencies - `histogram_quantile(0.95, ...)` for p95 percentile**
- **But notice we group by `topic_id` not `subscription_id` - because this is a topic-level metric**
- **Publishers write to topics, consumers read from subscriptions"**

**"What you're looking at:**
- **Each line is a different topic**
- **The Y-axis shows latency in seconds**
- **If a line spikes, publishers are experiencing delays - check network or Pub/Sub service health"**

---

## SECTION 3: BACKLOG HEALTH

### Opening for This Section

**"The third section shows backlog health - the state of unprocessed messages."**

---

### METRIC 5: BACKLOG BYTES

**What to Show:**
- Point to the Backlog Bytes chart
- Highlight logarithmic scale
- Show how it's different from UnAck Msg Count

**What to Say:**

**"This metric shows 'Backlog Bytes' - the total size of unprocessed messages."**

**"Why we need this:**
- **It shows the memory/storage footprint of unprocessed messages**
- **Large backlogs consume more resources**
- **It helps with capacity planning - how much storage do we need?**
- **Growing backlog means consumers are falling behind"**

**"Why this aggregation:**
- **We use `sum by (subscription_id)(...)` - summing total bytes per subscription**
- **No rate() because this is an absolute value - total bytes waiting"**

**"Why logarithmic scale:**
- **Again, CRITICAL - we use logarithmic scale here**
- **Some services have KiB, others have MiB, some have GiB**
- **Without logarithmic scale, GiB services would dominate**
- **With it, we can see spikes for any service regardless of size"**

**"What you're looking at:**
- **Each line is a different subscription**
- **The Y-axis is logarithmic and shows bytes (automatically converts to KiB/MiB/GiB)**
- **If a line spikes upward, that service's backlog is growing in size - may need to scale consumers"**

---

### METRIC 6: OLDEST UNACK MSG AGE

**What to Show:**
- Point to the Oldest UnAck Age chart
- Show age in seconds/hours/days
- Explain what "oldest" means

**What to Say:**

**"This metric shows 'Oldest Unacknowledged Message Age' - the age of the oldest message waiting to be processed."**

**"Why we need this:**
- **It's a stuck message detector - if messages are old, they're not being processed**
- **It indicates if consumers are dead or stuck**
- **Critical for SLA compliance - old messages may contain stale data**
- **If age keeps increasing, consumers are definitely not working"**

**"Why this aggregation:**
- **We use `max by (subscription_id)(...)` - showing the maximum (oldest) age per subscription**
- **We want the oldest message, not average - that's what tells us if messages are stuck"**

**"Why linear scale:**
- **Age is already in seconds, so it's naturally comparable across services**
- **A message that's 1 hour old is old regardless of which service it's in**
- **No normalization needed - absolute values work fine"**

**"What you're looking at:**
- **Each line is a different subscription**
- **The Y-axis shows age in seconds (or hours/days if converted)**
- **If a line shows high age (hours/days), that service has stuck messages - investigate immediately"**
- **If age keeps increasing, consumers are definitely not processing"**

---

### METRIC 7: EXPIRED ACK DEADLINES COUNT

**What to Show:**
- Point to the Expired Deadlines chart
- Show rate (per second)
- Explain what expired deadlines mean

**What to Say:**

**"This final metric shows 'Expired Acknowledgment Deadlines Count' - messages that exceeded their processing deadline."**

**"Why we need this:**
- **It's a processing failure indicator - expired deadlines mean consumers are too slow**
- **Any expired deadline is a problem - messages get redelivered**
- **It shows if consumers can't process within the ack deadline**
- **This is critical - if this is > 0, we have a problem"**

**"Why this aggregation:**
- **We use `sum by (subscription_id)(rate(...))` - showing expired deadlines per second**
- **`rate()` converts to per-second rate, which is more meaningful than total count**
- **We group by subscription to see which services have problems"**

**"What you're looking at:**
- **Each line is a different subscription**
- **The Y-axis shows expired deadlines per second**
- **If ANY line is above zero, that service has processing failures - investigate immediately"**
- **If a line spikes, consumers are definitely too slow - may need to increase ack deadline or scale consumers"**

---

================================================================================
PART 4: COMMON QUESTIONS AND ANSWERS
================================================================================

## QUESTION 1: "Why do we need all 7 metrics? Can't we just use one or two?"

**Answer:**

**"Great question. Each metric tells us something different:**

- **Ack Msg Count** - Are consumers working? (throughput)
- **UnAck Msg Count** - Are consumers keeping up? (backlog)
- **Ack Latencies** - Are consumers fast enough? (performance)
- **Publish Latencies** - Are publishers working? (publisher health)
- **Backlog Bytes** - How much storage is used? (capacity)
- **Oldest UnAck Age** - Are messages stuck? (stuck detection)
- **Expired Deadlines** - Are consumers too slow? (failure indicator)

**You need all 7 because:**
- **One metric alone doesn't tell the full story**
- **For example, Ack Msg Count might be high, but if Expired Deadlines is also high, consumers are still too slow**
- **UnAck Msg Count might be low, but if Oldest Age is high, messages are stuck**
- **Together, they give us a complete picture of system health"**

---

## QUESTION 2: "Why use rate() for some metrics but not others?"

**Answer:**

**"Excellent question. We use `rate()` for metrics that represent 'events over time':**

- **Ack Msg Count** - We want messages per second, not total count
- **Expired Deadlines** - We want failures per second, not total failures

**We DON'T use `rate()` for metrics that represent 'current state':**

- **UnAck Msg Count** - This is the current backlog size (absolute value)
- **Backlog Bytes** - This is current storage used (absolute value)
- **Oldest UnAck Age** - This is current age (absolute value)

**Think of it this way:**
- **If it's a 'count' that changes over time → use `rate()`**
- **If it's a 'state' that we measure → don't use `rate()`"**

---

## QUESTION 3: "Why use logarithmic scale? Why not just use regular scale?"

**Answer:**

**"This is critical for cross-service comparison. Let me show you why:**

**Without logarithmic scale:**
- **Service A: 10 messages → barely visible on chart**
- **Service B: 1,000 messages → visible**
- **Service C: 1,000,000 messages → dominates the chart, others invisible**

**With logarithmic scale:**
- **Service A: 10 messages → clearly visible**
- **Service B: 1,000 messages → clearly visible**
- **Service C: 1,000,000 messages → clearly visible**
- **All services visible, spikes detectable for any service**

**This is a hard requirement - we MUST be able to see spikes for services with tens, thousands, or millions of messages. Logarithmic scale makes this possible."**

---

## QUESTION 4: "Why p95 for latencies? Why not average or p99?"

**Answer:**

**"Great question. We use p95 (95th percentile) because:**

- **Average can hide outliers - if 99% of messages are fast but 1% are slow, average looks good but users experience slowness**
- **p99 (99th percentile) shows worst-case, but might be too sensitive to rare events**
- **p95 (95th percentile) shows what 95% of users experience - a good balance**

**Example:**
- **Average: 1 second (looks good)**
- **p95: 5 seconds (shows real user experience)**
- **p99: 10 seconds (worst case, but rare)**

**p95 gives us the 'typical worst case' - what most users experience on a bad day."**

---

## QUESTION 5: "What's the difference between UnAck Msg Count and Backlog Bytes?"

**Answer:**

**"Both measure backlog, but from different angles:**

- **UnAck Msg Count** - How many messages are waiting (count)
- **Backlog Bytes** - How much storage those messages use (size)

**Why both?**
- **UnAck Msg Count** - Tells us if we have a processing problem (too many messages)
- **Backlog Bytes** - Tells us if we have a storage/capacity problem (messages are large)

**Example scenario:**
- **UnAck Msg Count: 100 messages (low)**
- **Backlog Bytes: 10 GiB (high)**
- **This means we have few messages, but they're very large - storage concern**

**Or:**
- **UnAck Msg Count: 1,000,000 messages (high)**
- **Backlog Bytes: 100 MiB (low)**
- **This means we have many small messages - processing concern**

**Together, they give us complete backlog visibility."**

---

## QUESTION 6: "Why group by subscription_id? Can't we just see totals?"

**Answer:**

**"We group by subscription_id because:**

- **Each subscription is a different service/environment**
- **If we just see totals, we can't tell which service has a problem**
- **Grouping lets us:**
  - **Identify which service is causing issues**
  - **Compare performance across services**
  - **Set service-specific alerts**
  - **Troubleshoot specific services**

**Example:**
- **Total UnAck Count: 1,000,000 (high)**
- **But which service? We don't know!**

**With grouping:**
- **TRAN-PRD: 50 messages (normal)**
- **CS-CAT: 950,000 messages (problem!)**
- **Now we know CS-CAT needs attention"**

---

## QUESTION 7: "What should I do if I see a spike in one of these metrics?"

**Answer:**

**"Great question. Here's the action plan:**

**If Ack Msg Count drops:**
- **Check if consumers are down**
- **Check consumer application logs**
- **Verify consumer pods are running**

**If UnAck Msg Count spikes:**
- **Consumers are falling behind**
- **Check consumer performance**
- **Consider scaling consumers horizontally**
- **Check for processing errors**

**If Ack Latencies spike:**
- **Consumers are slow**
- **Check consumer application performance**
- **Verify resources (CPU, memory)**
- **Consider optimizing consumer code**

**If Expired Deadlines > 0:**
- **CRITICAL - consumers are too slow**
- **Immediate action required**
- **Check consumer health**
- **Consider increasing ack deadline or scaling consumers**

**If Oldest UnAck Age is high:**
- **Messages are stuck**
- **Consumers may be dead**
- **Check consumer application status**
- **Restart consumers if needed"**

---

## QUESTION 8: "How often should we check these dashboards?"

**Answer:**

**"It depends on your role:**

- **On-call engineers: Check every 15-30 minutes during incidents**
- **Operations team: Check daily during business hours**
- **Management: Review weekly trends**

**But the real answer is: We should set up alerts so we don't have to constantly check.**
- **Critical metrics (Expired Deadlines, Oldest Age) → Alert immediately**
- **Warning metrics (High Latency, High Backlog) → Alert on threshold**

**Dashboards are for investigation and trends. Alerts notify us when action is needed."**

---

## QUESTION 9: "Why did we remove Pull Request metric?"

**Answer:**

**"Good catch. We removed Pull Request because:**

- **It was redundant with Ack Msg Count**
- **Ack Msg Count is more informative - it shows successful processing**
- **Pull Request just shows requests, not successful processing**
- **Having both created confusion and noise**

**We kept Ack Msg Count because it tells us if messages are actually being processed, not just requested."**

---

## QUESTION 10: "What's the difference between this dashboard and the old ones?"

**Answer:**

**"Key improvements:**

1. **Consolidated view - all 7 metrics in one place**
2. **Normalized metrics - can compare services regardless of scale**
3. **Removed noise - deleted empty widgets and redundant metrics**
4. **Better organization - grouped by category (Throughput, Latency, Backlog)**
5. **Cross-service comparison - logarithmic scales make all services visible**

**Old dashboards:**
- **Separate dashboards for each service**
- **Couldn't compare across services**
- **Lots of empty widgets**
- **Redundant metrics**

**New dashboard:**
- **One unified view**
- **All services comparable**
- **Clean, focused metrics**
- **Actionable insights"**

---

================================================================================
PART 5: PRESENTATION TIPS
================================================================================

## Do's

✅ **Start with the big picture** - Explain why we monitor these metrics
✅ **Show real data** - Point to actual charts and values
✅ **Use examples** - "If you see this, it means that..."
✅ **Explain the "why"** - Not just what, but why it matters
✅ **Be prepared for questions** - Have this guide ready
✅ **Show normalization** - Demonstrate how logarithmic scale works
✅ **Connect to business impact** - "If this fails, users experience..."

## Don'ts

❌ **Don't just read the chart titles** - Explain what they mean
❌ **Don't skip the "why"** - Always explain why we need each metric
❌ **Don't rush** - Give time for questions
❌ **Don't use jargon without explanation** - Explain terms like "p95", "rate()", etc.
❌ **Don't ignore empty charts** - If something shows no data, explain why

## Handling Questions

1. **Listen fully** - Let them finish the question
2. **Acknowledge** - "That's a great question"
3. **Answer directly** - Use the Q&A section above
4. **Show, don't just tell** - Point to the dashboard if relevant
5. **If you don't know** - "Let me check and get back to you" (then use this guide)

---

================================================================================
PART 6: CLOSING SCRIPT
================================================================================

## Closing Statement (30 seconds)

**"To summarize what we've covered:**

**We now have a consolidated dashboard monitoring all 7 core Pub/Sub metrics.**
**The key improvement is normalization - we can now compare services regardless of their scale.**
**Each metric tells us something different about system health.**
**Together, they give us complete visibility into our message processing system.**

**Next steps:**
- **We'll set up alerts based on these metrics**
- **We'll review this dashboard regularly**
- **We'll use it for troubleshooting when issues occur**

**Are there any questions?"**

---

## After Questions

**"Thank you all for your time. If you have questions later, feel free to reach out.**
**The dashboard is available in [location], and I'll share this walkthrough guide with everyone."**

---

================================================================================
PART 7: QUICK REFERENCE - METRIC SUMMARY
================================================================================

| Metric | What It Shows | Why We Need It | Aggregation | Scale |
|--------|--------------|----------------|-------------|-------|
| **Ack Msg Count** | Messages processed/sec | Throughput indicator | `sum by (subscription_id)(rate(...))` | Linear/Log |
| **UnAck Msg Count** | Messages waiting | Backlog indicator | `sum by (subscription_id)(...)` | **Logarithmic** |
| **Ack Latencies** | Processing time | Consumer performance | `histogram_quantile(0.95, ...)` | Linear |
| **Publish Latencies** | Publishing time | Publisher performance | `histogram_quantile(0.95, ...)` | Linear |
| **Backlog Bytes** | Storage used | Capacity planning | `sum by (subscription_id)(...)` | **Logarithmic** |
| **Oldest UnAck Age** | Age of oldest message | Stuck message detector | `max by (subscription_id)(...)` | Linear |
| **Expired Deadlines** | Processing failures | Failure indicator | `sum by (subscription_id)(rate(...))` | Linear |

---

================================================================================
END OF GUIDE
================================================================================

**Remember:**
- **Be confident** - You know this system
- **Explain the "why"** - Not just the "what"
- **Use examples** - Real scenarios help understanding
- **Be prepared** - Have this guide ready for questions
- **Show, don't tell** - Point to actual charts

**Good luck with your demo!**





