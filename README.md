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





# Core Pub/Sub Metrics: Importance, Usage, and Alerting Guide

## Overview

This document explains why the 7 core Pub/Sub metrics are critical for monitoring, how they work, and what alerts should be configured for each.

---

## 1. ACK MSG COUNT (Acknowledged Message Count)

### Why It's Important
- **Primary throughput indicator**: Shows how many messages are successfully processed per second
- **Consumer health signal**: Indicates if consumers are actively working
- **Capacity planning**: Helps determine if consumers can handle current load
- **SLA compliance**: Essential for measuring message processing rate against SLAs

### How It Works
- Measures the rate at which messages are acknowledged (successfully processed)
- Counts messages that consumers have completed processing and acknowledged
- Typically displayed as messages per second (rate metric)
- **High value = Good**: Consumers are processing messages efficiently
- **Low/Dropping value = Bad**: Consumers may be slow, down, or failing

### Alert Configuration

**Alert Type 1: Throughput Drop (WARNING)**
```
Alert Name: "Pub/Sub - Acknowledged Message Count Drop"
Metric: pubsub.googleapis.com/subscription/ack_message_count
Condition: Drop > 50% from baseline in 10 minutes
Evaluation Window: 10 minutes
Severity: WARNING
Notification: Email + Slack
```

**What it detects:**
- Sudden decrease in processing rate
- Consumer application failures
- Service degradation
- Network issues affecting consumers

**Alert Type 2: Zero Throughput (CRITICAL)**
```
Alert Name: "Pub/Sub - Zero Acknowledged Messages"
Metric: pubsub.googleapis.com/subscription/ack_message_count
Condition: Value = 0 for 5 minutes
Evaluation Window: 5 minutes
Severity: CRITICAL
Notification: PagerDuty + Email + Slack
```

**What it detects:**
- All consumers are down
- Complete processing failure
- Critical system outage

**Observability Use:**
- Track processing trends over time
- Compare throughput across environments
- Identify peak processing times
- Capacity planning and scaling decisions

---

## 2. UNACK MSG COUNT (Unacknowledged Message Count)

### Why It's Important
- **Backlog indicator**: Shows how many messages are waiting to be processed
- **Consumer lag detector**: Indicates if consumers are falling behind publishers
- **System health signal**: Rising count = consumers can't keep up
- **Resource planning**: Helps determine when to scale consumers

### How It Works
- Counts messages that have been delivered but not yet acknowledged
- Increases when publish rate > processing rate
- Decreases when consumers process messages faster than they arrive
- **Low/Zero = Good**: Consumers are keeping up
- **Rising/High = Bad**: Backlog is building, consumers are lagging

### Alert Configuration

**Alert Type 1: High Unacknowledged Count (CRITICAL)**
```
Alert Name: "Pub/Sub - High Unacknowledged Message Count"
Metric: pubsub.googleapis.com/subscription/num_undelivered_messages
Condition: Value > threshold (service-specific)
  - HS1-PRD: > 50 messages
  - TRAN-PRD: > 1M messages
  - TRAN-MSG: > 5M messages
  - CS-CAT: > 500M messages
Evaluation Window: 5 minutes
Severity: CRITICAL
Notification: PagerDuty + Email + Slack
```

**What it detects:**
- Consumers are down or slow
- Processing rate is lower than publish rate
- Consumer application errors
- Need for horizontal scaling

**Alert Type 2: Rapid Backlog Growth (WARNING)**
```
Alert Name: "Pub/Sub - Rapid Backlog Growth"
Metric: pubsub.googleapis.com/subscription/num_undelivered_messages
Condition: Increase > 100% in 5 minutes
Evaluation Window: 5 minutes
Severity: WARNING
Notification: Email + Slack
```

**What it detects:**
- Sudden spike in message publishing
- Consumer performance degradation
- Early warning before critical backlog

**Observability Use:**
- Monitor backlog trends
- Identify patterns (peak hours, traffic spikes)
- Capacity planning
- Consumer performance analysis

---

## 3. ACK LATENCIES (Acknowledgment Latencies)

### Why It's Important
- **Consumer performance metric**: Shows how long it takes to process messages
- **SLA compliance**: Critical for meeting processing time SLAs
- **Bottleneck identification**: Helps find slow processing operations
- **User experience impact**: High latency = delayed business operations

### How It Works
- Measures time from message delivery to acknowledgment
- Distribution metric (shows p50, p95, p99 percentiles)
- **Low latency = Good**: Fast processing
- **High latency = Bad**: Slow processing, potential bottlenecks

### Alert Configuration

**Alert Type 1: High Acknowledgment Latency (CRITICAL/WARNING)**
```
Alert Name: "Pub/Sub - High Acknowledgment Latency"
Metric: pubsub.googleapis.com/subscription/ack_latencies
Condition: p95 percentile > threshold (service-specific)
  - TRAN-PRD: > 10 minutes (CRITICAL - seen 15min in production)
  - CS-CAT: > 60 seconds (WARNING)
  - TRAN-MSG: > 60 seconds (WARNING)
  - HS1-PRD: > 2 seconds (WARNING)
Evaluation Window: 5 minutes
Severity: CRITICAL (TRAN-PRD), WARNING (others)
Notification: PagerDuty + Email + Slack (CRITICAL), Email + Slack (WARNING)
```

**What it detects:**
- Consumers are slow to process messages
- Consumer application performance issues
- Database or external service slowdowns
- Resource constraints (CPU, memory)
- Code inefficiencies

**Alert Type 2: Latency Spike (WARNING)**
```
Alert Name: "Pub/Sub - Acknowledgment Latency Spike"
Metric: pubsub.googleapis.com/subscription/ack_latencies
Condition: p95 latency increases > 200% in 5 minutes
Evaluation Window: 5 minutes
Severity: WARNING
Notification: Email + Slack
```

**What it detects:**
- Sudden performance degradation
- External dependency issues
- Resource contention

**Observability Use:**
- Track latency trends over time
- Identify slow operations
- Performance optimization analysis
- Compare latency across environments
- Capacity planning

---

## 4. PUBLISH REQUESTS LATENCIES (Publish Request Latencies)

### Why It's Important
- **Publisher performance metric**: Shows how long it takes to publish messages
- **Publisher health signal**: High latency indicates publisher or Pub/Sub service issues
- **End-to-end latency component**: Affects total message delivery time
- **Service availability**: Detects Pub/Sub service degradation

### How It Works
- Measures time from publish request to successful publish
- Distribution metric (shows p50, p95, p99 percentiles)
- **Low latency = Good**: Fast publishing
- **High latency = Bad**: Publisher or Pub/Sub service issues

### Alert Configuration

**Alert Type 1: High Publish Latency (WARNING)**
```
Alert Name: "Pub/Sub - High Publish Request Latency"
Metric: pubsub.googleapis.com/topic/send_request_latencies
Condition: p95 percentile > threshold (service-specific)
  - TRAN-MSG: > 500ms
  - TRAN-PRD: > 100ms
  - HS1-PRD: > 30ms
Evaluation Window: 5 minutes
Severity: WARNING
Notification: Email + Slack
```

**What it detects:**
- Publishers experiencing delays
- Network issues
- Pub/Sub service performance issues
- Publisher application problems
- Topic configuration issues

**Alert Type 2: Publish Latency Spike (WARNING)**
```
Alert Name: "Pub/Sub - Publish Latency Spike"
Metric: pubsub.googleapis.com/topic/send_request_latencies
Condition: p95 latency increases > 300% in 5 minutes
Evaluation Window: 5 minutes
Severity: WARNING
Notification: Email + Slack
```

**What it detects:**
- Sudden Pub/Sub service degradation
- Network congestion
- Publisher application issues

**Observability Use:**
- Monitor publisher performance
- Track Pub/Sub service health
- Identify publishing bottlenecks
- Performance optimization

---

## 5. BACKLOG BYTES (Backlog Size in Bytes)

### Why It's Important
- **Memory/storage indicator**: Shows total size of unprocessed messages
- **Resource planning**: Helps estimate storage requirements
- **Cost management**: Large backlogs consume more resources
- **System health**: Growing backlog = consumers falling behind

### How It Works
- Measures total byte size of all unacknowledged messages
- Increases when message size × message count grows
- **Low/Stable = Good**: Consumers keeping up
- **Rising/High = Bad**: Large backlog, potential memory issues

### Alert Configuration

**Alert Type 1: High Backlog Bytes (WARNING)**
```
Alert Name: "Pub/Sub - High Backlog Bytes"
Metric: pubsub.googleapis.com/subscription/backlog_bytes
Condition: Value > threshold (service-specific)
  - TRAN-PRD: > 1GB
  - HS1-PRD: > 200KiB
  - CS-PRD: > 500KiB
Evaluation Window: 10 minutes
Severity: WARNING
Notification: Email + Slack
```

**What it detects:**
- Large amount of unprocessed messages
- Need to scale consumers
- Message processing rate issues
- Potential memory/storage concerns

**Alert Type 2: Rapid Backlog Growth (WARNING)**
```
Alert Name: "Pub/Sub - Rapid Backlog Bytes Growth"
Metric: pubsub.googleapis.com/subscription/backlog_bytes
Condition: Increase > 200% in 10 minutes
Evaluation Window: 10 minutes
Severity: WARNING
Notification: Email + Slack
```

**What it detects:**
- Sudden increase in message size or count
- Consumer performance degradation
- Early warning before critical backlog

**Observability Use:**
- Monitor storage usage
- Track message size trends
- Capacity planning
- Cost estimation

---

## 6. OLDEST UNACK MSG AGE (Oldest Unacknowledged Message Age)

### Why It's Important
- **Stuck message detector**: Identifies messages that aren't being processed
- **Consumer health indicator**: Old messages = consumers may be dead or stuck
- **SLA compliance**: Critical for detecting message processing delays
- **Data freshness**: Old messages may contain stale data

### How It Works
- Measures age of the oldest unacknowledged message
- Shows how long the oldest message has been waiting
- **Low/Zero = Good**: Messages are being processed promptly
- **High = Bad**: Messages are stuck, consumers may be dead

### Alert Configuration

**Alert Type 1: Old Unacknowledged Message Age (CRITICAL)**
```
Alert Name: "Pub/Sub - Oldest Unacknowledged Message Age Too High"
Metric: pubsub.googleapis.com/subscription/oldest_unacked_message_age
Condition: Value > threshold (service-specific)
  - CS-PRD: > 1 week (CRITICAL - seen 1.5 weeks in production)
  - TRAN-PRD: > 1 day
  - TRAN-MSG: > 1 week
  - HS1-PRD: > 30 seconds
Evaluation Window: 10 minutes
Severity: CRITICAL
Notification: PagerDuty + Email + Slack
```

**What it detects:**
- Messages are stuck and not being processed
- Consumer may be dead or unresponsive
- Consumer application crashes
- Processing errors preventing acknowledgment
- Dead letter queue needed

**Alert Type 2: Message Age Increasing (WARNING)**
```
Alert Name: "Pub/Sub - Oldest Message Age Increasing"
Metric: pubsub.googleapis.com/subscription/oldest_unacked_message_age
Condition: Value continuously increasing for 30 minutes
Evaluation Window: 30 minutes
Severity: WARNING
Notification: Email + Slack
```

**What it detects:**
- Consumers are falling behind
- Early warning before messages get too old
- Processing rate degradation

**Observability Use:**
- Track message freshness
- Identify stuck consumers
- Monitor processing delays
- SLA compliance tracking

---

## 7. EXPIRED ACK DEADLINES COUNT (Expired Acknowledgment Deadlines)

### Why It's Important
- **Processing failure indicator**: Shows messages that exceeded their ack deadline
- **Consumer performance signal**: Indicates consumers are too slow
- **Message redelivery trigger**: Expired deadlines cause message redelivery
- **System health**: Any expired deadline is a problem

### How It Works
- Counts messages that exceeded their acknowledgment deadline
- Messages are redelivered when deadline expires
- **Zero = Good**: All messages processed within deadline
- **Any value > 0 = Bad**: Processing failures, consumers too slow

### Alert Configuration

**Alert Type 1: Any Expired Deadlines (CRITICAL)**
```
Alert Name: "Pub/Sub - Expired Acknowledgment Deadlines"
Metric: pubsub.googleapis.com/subscription/expired_ack_deadlines_count
Condition: Value > 0 (any expired deadline is critical)
Evaluation Window: 1 minute
Severity: CRITICAL
Notification: PagerDuty + Email + Slack
```

**What it detects:**
- Messages exceeded their ack deadline
- Consumers are not processing fast enough
- Consumer application performance issues
- Need to increase ack deadline or scale consumers
- Processing errors causing delays

**Alert Type 2: High Expired Deadline Rate (CRITICAL)**
```
Alert Name: "Pub/Sub - High Expired Deadline Rate"
Metric: pubsub.googleapis.com/subscription/expired_ack_deadlines_count
Condition: Rate > threshold (service-specific)
  - TRAN-MSG: > 2/s
  - TRAN-PRD: > 1/s
  - CS-CAT: > 0.3/s
Evaluation Window: 1 minute
Severity: CRITICAL
Notification: PagerDuty + Email + Slack
```

**What it detects:**
- Sustained processing failures
- Consumer application issues
- Critical performance problems

**Observability Use:**
- Track processing failures
- Monitor consumer performance
- Identify problematic subscriptions
- Tune acknowledgment deadlines

---

## Summary: Metrics vs. Alerts vs. Observability

### All Metrics Serve Multiple Purposes:

1. **Observability (Always)**
   - All 7 metrics provide visibility into system health
   - Dashboards show trends, patterns, and historical data
   - Essential for troubleshooting and capacity planning

2. **Alerting (Actionable)**
   - All 7 metrics can and should have alerts configured
   - Alerts trigger when thresholds are exceeded
   - Enables proactive issue detection and resolution

3. **Both Are Critical**
   - **Observability without alerts**: You'll see problems but won't be notified
   - **Alerts without observability**: You'll be notified but won't have context
   - **Best practice**: Use both together

---

## Alert Priority Matrix

### CRITICAL Alerts (PagerDuty + Email + Slack)
1. **Expired Ack Deadlines Count > 0** - Any expired deadline is critical
2. **Oldest UnAck Msg Age > threshold** - Messages stuck too long
3. **UnAck Msg Count > threshold** - Backlog building up
4. **Ack Latency p95 > threshold** (for critical services) - Extremely slow processing
5. **Zero Ack Msg Count** - All consumers down

### WARNING Alerts (Email + Slack)
1. **Backlog Bytes > threshold** - Large backlog growing
2. **Publish Latency p95 > threshold** - Publisher performance issue
3. **Ack Msg Count Drop > 50%** - Throughput degradation
4. **Ack Latency p95 > threshold** (for non-critical services) - Slow processing

---

## Recommended Alert Configuration Summary

| Metric | Alert Type | Threshold | Severity | Evaluation Window |
|--------|-----------|-----------|----------|-------------------|
| Ack Msg Count | Drop > 50% | 50% decrease | WARNING | 10 min |
| Ack Msg Count | Zero | 0 for 5 min | CRITICAL | 5 min |
| UnAck Msg Count | High | Service-specific | CRITICAL | 5 min |
| Ack Latencies | High p95 | Service-specific | CRITICAL/WARNING | 5 min |
| Publish Latencies | High p95 | Service-specific | WARNING | 5 min |
| Backlog Bytes | High | Service-specific | WARNING | 10 min |
| Oldest UnAck Age | High | Service-specific | CRITICAL | 10 min |
| Expired Deadlines | Any | > 0 | CRITICAL | 1 min |

---

## Key Takeaways

1. **All 7 metrics are essential** - Each provides unique insights into Pub/Sub health
2. **Both observability and alerting are needed** - Dashboards for context, alerts for action
3. **Service-specific thresholds** - Different services have different baselines
4. **Start conservative, tune based on data** - Adjust thresholds based on actual usage patterns
5. **Monitor trends, not just thresholds** - Use observability to understand patterns
6. **Alert on actionable conditions** - Focus on issues that require human intervention

---

## Next Steps

1. **Set up dashboards** with all 7 metrics
2. **Configure critical alerts first** (Expired Deadlines, Oldest Age, High UnAck Count)
3. **Add warning alerts** for proactive monitoring
4. **Tune thresholds** based on baseline metrics over 1-2 weeks
5. **Create runbooks** for each alert type
6. **Review and adjust** monthly based on alert frequency and false positives

---

END OF DOCUMENT


