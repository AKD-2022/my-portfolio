# Redis Monitoring and Alerting - Complete Guide

## Overview

This document explains the core Redis metrics to monitor, why they're important, and how to configure alerts for each. Based on MCOM metrics and Redis best practices.

---

## Core Redis Metrics to Monitor

### Critical Metrics (Must Monitor)

1. **Cache Hit Ratio** - Performance indicator
2. **System Memory Usage** - Resource health
3. **Used Memory per Node** - Memory capacity
4. **Evicted/Expired Keys per Minute** - Cache efficiency
5. **Connected Clients** - Connection health
6. **Blocked Clients** - Performance bottleneck
7. **Instance Uptime** - Availability
8. **Latency** - Performance indicator

### Important Metrics (Should Monitor)

9. **Total Instances Percentage** - Availability
10. **Calls & Time per Call** - Performance analysis
11. **CPU Seconds** - Resource utilization
12. **Network Bytes In/Out** - Network health
13. **Keys in DB per Node** - Data volume
14. **Expirable Keys in DB per Node** - Data management
15. **Bytes Pending** - Memory pressure

---

## 1. CACHE HIT RATIO (C & E)

### Why It's Important
- **Primary performance indicator**: Shows how effective your cache is
- **Cost optimization**: Low hit ratio = unnecessary database load
- **User experience**: High hit ratio = faster response times
- **Capacity planning**: Helps determine if cache size is adequate

### How It Works
- **Cache Hit Ratio (C)**: Percentage of requests served from cache
- **Cache Hit Ratio (E)**: May refer to different calculation method or environment
- **Formula**: (Cache Hits / Total Requests) × 100
- **High value (90%+) = Good**: Most requests served from cache
- **Low value (<70%) = Bad**: Too many cache misses, database overload

### Alert Configuration

**Alert Type 1: Low Cache Hit Ratio (WARNING)**
```
Alert Name: "Redis - Low Cache Hit Ratio"
Metric: redis.googleapis.com/stats/cache_hit_ratio
Condition: Value < threshold
  - Production: < 70%
  - Staging: < 60%
Evaluation Window: 15 minutes
Severity: WARNING
Notification: Email + Slack
```

**What it detects:**
- Cache is not effective
- Too many cache misses
- Possible cache eviction issues
- Need to increase cache size or optimize keys

**Alert Type 2: Cache Hit Ratio Drop (WARNING)**
```
Alert Name: "Redis - Cache Hit Ratio Drop"
Metric: redis.googleapis.com/stats/cache_hit_ratio
Condition: Drop > 20% from baseline in 15 minutes
Evaluation Window: 15 minutes
Severity: WARNING
Notification: Email + Slack
```

**What it detects:**
- Sudden degradation in cache performance
- Cache invalidation issues
- Traffic pattern changes
- Memory pressure causing evictions

**Observability Use:**
- Track cache effectiveness over time
- Compare hit ratios across environments
- Identify patterns (peak hours, traffic spikes)
- Capacity planning

---

## 2. SYSTEM MEMORY USAGE (C & E)

### Why It's Important
- **Resource health**: Shows overall memory consumption
- **Capacity planning**: Helps determine when to scale
- **Performance indicator**: High memory usage can cause slowdowns
- **Cost management**: Memory is a key cost factor

### How It Works
- **System Memory Usage (C)**: May refer to container/system level
- **System Memory Usage (E)**: May refer to different environment or calculation
- Measures total memory used by Redis and system
- **Low/Moderate = Good**: Healthy memory usage
- **High (>85%) = Bad**: Risk of OOM (Out of Memory) errors

### Alert Configuration

**Alert Type 1: High System Memory Usage (CRITICAL)**
```
Alert Name: "Redis - High System Memory Usage"
Metric: redis.googleapis.com/stats/memory/system_memory_usage
Condition: Value > threshold
  - Production: > 85%
  - Staging: > 90%
Evaluation Window: 10 minutes
Severity: CRITICAL
Notification: PagerDuty + Email + Slack
```

**What it detects:**
- Memory pressure
- Risk of OOM errors
- Need to scale up or optimize
- Memory leaks

**Alert Type 2: Rapid Memory Growth (WARNING)**
```
Alert Name: "Redis - Rapid Memory Growth"
Metric: redis.googleapis.com/stats/memory/system_memory_usage
Condition: Increase > 10% in 15 minutes
Evaluation Window: 15 minutes
Severity: WARNING
Notification: Email + Slack
```

**What it detects:**
- Memory leak
- Sudden traffic spike
- Data accumulation
- Early warning before critical memory usage

**Observability Use:**
- Track memory trends
- Capacity planning
- Identify memory leaks
- Optimize memory usage

---

## 3. USED MEMORY PER NODE

### Why It's Important
- **Node-level visibility**: Shows memory usage per Redis node
- **Cluster health**: Identifies nodes with memory issues
- **Load balancing**: Helps identify uneven memory distribution
- **Scaling decisions**: Determines when to add nodes

### How It Works
- Measures memory used by each Redis node
- Critical in Redis Cluster setups
- **Balanced across nodes = Good**: Even distribution
- **Uneven/High = Bad**: Some nodes overloaded

### Alert Configuration

**Alert Type 1: High Used Memory per Node (CRITICAL)**
```
Alert Name: "Redis - High Used Memory per Node"
Metric: redis.googleapis.com/stats/memory/used_memory
Condition: Value > threshold per node
  - Production: > 80% of maxmemory
  - Staging: > 85% of maxmemory
Evaluation Window: 10 minutes
Severity: CRITICAL
Notification: PagerDuty + Email + Slack
```

**What it detects:**
- Node-level memory pressure
- Uneven memory distribution
- Need to rebalance cluster
- Risk of node failure

**Alert Type 2: Memory Imbalance (WARNING)**
```
Alert Name: "Redis - Memory Imbalance Across Nodes"
Metric: redis.googleapis.com/stats/memory/used_memory
Condition: Max node memory - Min node memory > 30% of average
Evaluation Window: 15 minutes
Severity: WARNING
Notification: Email + Slack
```

**What it detects:**
- Uneven memory distribution
- Need for cluster rebalancing
- Hot spots in cluster

**Observability Use:**
- Monitor per-node memory
- Identify memory hotspots
- Cluster rebalancing decisions
- Capacity planning per node

---

## 4. EVICTED/EXPIRED KEYS PER MINUTE

### Why It's Important
- **Cache efficiency**: High evictions = cache too small or misconfigured
- **Performance impact**: Evictions cause performance degradation
- **Memory pressure indicator**: Evictions happen when memory is full
- **Cost optimization**: Frequent evictions = need larger cache

### How It Works
- **Evicted Keys**: Keys removed due to memory pressure (maxmemory policy)
- **Expired Keys**: Keys removed due to TTL expiration
- **Low evictions = Good**: Cache size adequate
- **High evictions = Bad**: Cache too small, frequent misses

### Alert Configuration

**Alert Type 1: High Evicted Keys Rate (CRITICAL)**
```
Alert Name: "Redis - High Evicted Keys Rate"
Metric: redis.googleapis.com/stats/keyspace/evicted_keys_per_minute
Condition: Rate > threshold
  - Production: > 1000 keys/minute
  - Staging: > 500 keys/minute
Evaluation Window: 5 minutes
Severity: CRITICAL
Notification: PagerDuty + Email + Slack
```

**What it detects:**
- Cache is too small
- Memory pressure
- Performance degradation
- Need to increase cache size

**Alert Type 2: Evicted Keys Spike (WARNING)**
```
Alert Name: "Redis - Evicted Keys Spike"
Metric: redis.googleapis.com/stats/keyspace/evicted_keys_per_minute
Condition: Increase > 500% in 5 minutes
Evaluation Window: 5 minutes
Severity: WARNING
Notification: Email + Slack
```

**What it detects:**
- Sudden memory pressure
- Traffic spike
- Configuration issue
- Early warning before sustained evictions

**Note on "Two Evicted Metrics":**
- **Evicted Keys**: Keys removed by eviction policy (memory pressure)
- **Expired Keys**: Keys removed by TTL expiration (normal operation)
- These are different metrics serving different purposes:
  - **Evicted = Problem**: Indicates memory pressure
  - **Expired = Normal**: Indicates proper TTL management

**Observability Use:**
- Track eviction patterns
- Monitor cache efficiency
- Identify memory pressure
- Optimize cache size and TTLs

---

## 5. CONNECTED CLIENTS

### Why It's Important
- **Connection health**: Shows active client connections
- **Capacity indicator**: Too many clients can cause performance issues
- **Resource usage**: Each connection consumes memory
- **Security**: Unusual connection count may indicate attack

### How It Works
- Counts active client connections to Redis
- **Stable/Expected = Good**: Normal operation
- **High/Spiking = Bad**: Possible connection leak or attack

### Alert Configuration

**Alert Type 1: High Connected Clients (WARNING)**
```
Alert Name: "Redis - High Connected Clients"
Metric: redis.googleapis.com/stats/clients/connected_clients
Condition: Value > threshold
  - Production: > 1000 clients
  - Staging: > 500 clients
Evaluation Window: 10 minutes
Severity: WARNING
Notification: Email + Slack
```

**What it detects:**
- Connection leak
- Too many clients
- Possible DDoS attack
- Need to increase maxclients

**Alert Type 2: Connected Clients Spike (WARNING)**
```
Alert Name: "Redis - Connected Clients Spike"
Metric: redis.googleapis.com/stats/clients/connected_clients
Condition: Increase > 200% in 5 minutes
Evaluation Window: 5 minutes
Severity: WARNING
Notification: Email + Slack
```

**What it detects:**
- Sudden connection surge
- Application connection leak
- Possible attack
- Early warning before capacity issues

**Observability Use:**
- Track connection patterns
- Identify connection leaks
- Monitor for attacks
- Capacity planning

---

## 6. BLOCKED CLIENTS

### Why It's Important
- **Performance bottleneck**: Blocked clients indicate slow operations
- **Command blocking**: Shows clients waiting for blocking commands (BLPOP, BRPOP, etc.)
- **System health**: High blocked clients = performance issues
- **Timeout risk**: Blocked clients may timeout

### How It Works
- Counts clients waiting for blocking operations
- **Zero/Low = Good**: No blocking operations
- **High = Bad**: Slow operations or blocking command issues

### Alert Configuration

**Alert Type 1: High Blocked Clients (CRITICAL)**
```
Alert Name: "Redis - High Blocked Clients"
Metric: redis.googleapis.com/stats/clients/blocked_clients
Condition: Value > threshold
  - Production: > 50 clients
  - Staging: > 20 clients
Evaluation Window: 5 minutes
Severity: CRITICAL
Notification: PagerDuty + Email + Slack
```

**What it detects:**
- Slow blocking operations
- Performance degradation
- Possible deadlock
- Need to investigate blocking commands

**Alert Type 2: Blocked Clients Persisting (WARNING)**
```
Alert Name: "Redis - Blocked Clients Persisting"
Metric: redis.googleapis.com/stats/clients/blocked_clients
Condition: Value > 10 for 10 minutes
Evaluation Window: 10 minutes
Severity: WARNING
Notification: Email + Slack
```

**What it detects:**
- Sustained blocking operations
- Performance issues
- Need to optimize blocking commands

**Observability Use:**
- Track blocking patterns
- Identify slow operations
- Monitor blocking command performance
- Optimize blocking operations

---

## 7. INSTANCE UPTIME

### Why It's Important
- **Availability indicator**: Shows how long instance has been running
- **Stability metric**: Frequent restarts indicate issues
- **Maintenance tracking**: Helps track planned vs unplanned restarts
- **SLA compliance**: Critical for availability SLAs

### How It Works
- Measures time since last restart
- **High/Stable = Good**: Instance is stable
- **Low/Frequent restarts = Bad**: Instance instability

### Alert Configuration

**Alert Type 1: Instance Restart (CRITICAL)**
```
Alert Name: "Redis - Instance Restart Detected"
Metric: redis.googleapis.com/stats/uptime
Condition: Uptime drops to < 1 minute (restart detected)
Evaluation Window: 1 minute
Severity: CRITICAL
Notification: PagerDuty + Email + Slack
```

**What it detects:**
- Unplanned instance restart
- Instance crash
- Maintenance activity
- Need to investigate cause

**Alert Type 2: Frequent Restarts (WARNING)**
```
Alert Name: "Redis - Frequent Instance Restarts"
Metric: redis.googleapis.com/stats/uptime
Condition: More than 2 restarts in 1 hour
Evaluation Window: 1 hour
Severity: WARNING
Notification: Email + Slack
```

**What it detects:**
- Instance instability
- Configuration issues
- Resource constraints
- Need to investigate root cause

**Observability Use:**
- Track instance stability
- Monitor restart frequency
- Identify patterns
- SLA compliance

---

## 8. LATENCY

### Why It's Important
- **Performance indicator**: Shows response time for Redis operations
- **User experience**: High latency = slow application
- **Bottleneck detection**: Helps identify slow operations
- **SLA compliance**: Critical for performance SLAs

### How It Works
- Measures time for Redis to respond to commands
- Distribution metric (shows p50, p95, p99 percentiles)
- **Low latency = Good**: Fast responses
- **High latency = Bad**: Slow responses, performance issues

### Alert Configuration

**Alert Type 1: High Latency (CRITICAL/WARNING)**
```
Alert Name: "Redis - High Latency"
Metric: redis.googleapis.com/stats/latency/p95
Condition: p95 percentile > threshold
  - Production: > 10ms (CRITICAL)
  - Staging: > 20ms (WARNING)
Evaluation Window: 5 minutes
Severity: CRITICAL (Production), WARNING (Staging)
Notification: PagerDuty + Email + Slack (CRITICAL), Email + Slack (WARNING)
```

**What it detects:**
- Slow Redis operations
- Performance degradation
- Resource constraints
- Network issues

**Alert Type 2: Latency Spike (WARNING)**
```
Alert Name: "Redis - Latency Spike"
Metric: redis.googleapis.com/stats/latency/p95
Condition: p95 latency increases > 200% in 5 minutes
Evaluation Window: 5 minutes
Severity: WARNING
Notification: Email + Slack
```

**What it detects:**
- Sudden performance degradation
- Traffic spike
- Resource contention
- Early warning before sustained high latency

**Important Note on Latency Metrics:**
- **Percent Change vs Absolute Values**: 
  - **For Latency, use ABSOLUTE VALUES (ms) for alerts**, not percent change
  - **Why?** Latency is measured in time units (milliseconds), not percentages
  - **Percent change alerts** are useful for detecting spikes, but thresholds should be in absolute time
  - **Best Practice**: Use absolute thresholds (e.g., > 10ms) for critical alerts, and percent change (e.g., > 200% increase) for spike detection

**Observability Use:**
- Track latency trends
- Identify slow operations
- Performance optimization
- Compare latency across environments

---

## 9. TOTAL INSTANCES PERCENTAGE

### Why It's Important
- **Availability indicator**: Shows percentage of healthy instances
- **Cluster health**: Critical in multi-instance setups
- **SLA compliance**: Essential for availability monitoring
- **Failover detection**: Identifies when instances are down

### How It Works
- Measures percentage of available Redis instances
- **100% = Good**: All instances healthy
- **< 100% = Bad**: Some instances down

### Alert Configuration

**Alert Type 1: Low Instance Availability (CRITICAL)**
```
Alert Name: "Redis - Low Instance Availability"
Metric: redis.googleapis.com/stats/instances/total_instances_percentage
Condition: Value < threshold
  - Production: < 90%
  - Staging: < 80%
Evaluation Window: 5 minutes
Severity: CRITICAL
Notification: PagerDuty + Email + Slack
```

**What it detects:**
- Instance failures
- Cluster degradation
- Availability issues
- Need to investigate failed instances

**Alert Type 2: Instance Availability Drop (WARNING)**
```
Alert Name: "Redis - Instance Availability Drop"
Metric: redis.googleapis.com/stats/instances/total_instances_percentage
Condition: Drop > 10% in 5 minutes
Evaluation Window: 5 minutes
Severity: WARNING
Notification: Email + Slack
```

**What it detects:**
- Instance health degradation
- Early warning before critical availability loss
- Cluster instability

**Observability Use:**
- Track instance availability
- Monitor cluster health
- SLA compliance
- Capacity planning

---

## 10. CALLS & TIME PER CALL

### Why It's Important
- **Throughput indicator**: Shows request rate
- **Performance analysis**: Time per call shows operation efficiency
- **Capacity planning**: Helps determine if instance can handle load
- **Bottleneck identification**: High time per call = slow operations

### How It Works
- **Calls**: Number of commands executed per second
- **Time per Call**: Average time to execute each command
- **High calls, Low time = Good**: Efficient processing
- **High calls, High time = Bad**: Overloaded instance

### Alert Configuration

**Alert Type 1: High Time per Call (WARNING)**
```
Alert Name: "Redis - High Time per Call"
Metric: redis.googleapis.com/stats/commands/time_per_call
Condition: Average time > threshold
  - Production: > 5ms
  - Staging: > 10ms
Evaluation Window: 10 minutes
Severity: WARNING
Notification: Email + Slack
```

**What it detects:**
- Slow operations
- Performance degradation
- Resource constraints
- Need to optimize commands

**Alert Type 2: Low Calls (WARNING)**
```
Alert Name: "Redis - Low Call Rate"
Metric: redis.googleapis.com/stats/commands/calls_per_second
Condition: Drop > 50% from baseline in 10 minutes
Evaluation Window: 10 minutes
Severity: WARNING
Notification: Email + Slack
```

**What it detects:**
- Application issues
- Connection problems
- Traffic drop
- Need to investigate application

**Observability Use:**
- Track throughput trends
- Monitor operation efficiency
- Capacity planning
- Performance optimization

---

## 11. CPU SECONDS

### Why It's Important
- **Resource utilization**: Shows CPU usage
- **Performance indicator**: High CPU = potential bottleneck
- **Scaling decisions**: Helps determine when to scale
- **Cost optimization**: High CPU may indicate need for better instance type

### How It Works
- Measures CPU time consumed by Redis
- **Low/Moderate = Good**: Healthy CPU usage
- **High (>80%) = Bad**: CPU bottleneck

### Alert Configuration

**Alert Type 1: High CPU Usage (WARNING)**
```
Alert Name: "Redis - High CPU Usage"
Metric: redis.googleapis.com/stats/cpu/cpu_seconds
Condition: CPU usage > threshold
  - Production: > 80%
  - Staging: > 90%
Evaluation Window: 10 minutes
Severity: WARNING
Notification: Email + Slack
```

**What it detects:**
- CPU bottleneck
- Need to scale up
- Performance degradation
- Resource constraints

**Alert Type 2: CPU Spike (WARNING)**
```
Alert Name: "Redis - CPU Usage Spike"
Metric: redis.googleapis.com/stats/cpu/cpu_seconds
Condition: Increase > 50% in 5 minutes
Evaluation Window: 5 minutes
Severity: WARNING
Notification: Email + Slack
```

**What it detects:**
- Sudden CPU increase
- Traffic spike
- Resource contention
- Early warning before sustained high CPU

**Observability Use:**
- Track CPU trends
- Capacity planning
- Identify CPU-intensive operations
- Optimize resource usage

---

## 12. NETWORK BYTES IN/OUT

### Why It's Important
- **Network health**: Shows data transfer rates
- **Traffic monitoring**: Helps identify traffic patterns
- **Bottleneck detection**: Network saturation can cause issues
- **Cost management**: Network usage affects costs

### How It Works
- **Bytes In**: Data received by Redis
- **Bytes Out**: Data sent by Redis
- **Balanced/Expected = Good**: Normal operation
- **High/Spiking = Bad**: Possible traffic spike or issue

### Alert Configuration

**Alert Type 1: High Network Usage (WARNING)**
```
Alert Name: "Redis - High Network Usage"
Metric: redis.googleapis.com/stats/network/bytes_in + bytes_out
Condition: Total bytes > threshold
  - Production: > 1GB/minute
  - Staging: > 500MB/minute
Evaluation Window: 5 minutes
Severity: WARNING
Notification: Email + Slack
```

**What it detects:**
- High traffic
- Possible DDoS attack
- Data transfer issues
- Need to investigate traffic source

**Alert Type 2: Network Usage Spike (WARNING)**
```
Alert Name: "Redis - Network Usage Spike"
Metric: redis.googleapis.com/stats/network/bytes_in + bytes_out
Condition: Increase > 300% in 5 minutes
Evaluation Window: 5 minutes
Severity: WARNING
Notification: Email + Slack
```

**What it detects:**
- Sudden traffic surge
- Possible attack
- Application issue
- Early warning before network saturation

**Observability Use:**
- Track network trends
- Monitor traffic patterns
- Identify anomalies
- Capacity planning

---

## 13. KEYS IN DB PER NODE

### Why It's Important
- **Data volume**: Shows number of keys stored
- **Capacity planning**: Helps determine when to scale
- **Performance impact**: Too many keys can slow down operations
- **Memory correlation**: Correlates with memory usage

### How It Works
- Counts total keys in database per node
- **Stable/Expected = Good**: Normal operation
- **Rapidly growing = Bad**: Possible key accumulation

### Alert Configuration

**Alert Type 1: High Key Count (WARNING)**
```
Alert Name: "Redis - High Key Count"
Metric: redis.googleapis.com/stats/keyspace/keys_in_db
Condition: Value > threshold per node
  - Production: > 10M keys
  - Staging: > 5M keys
Evaluation Window: 15 minutes
Severity: WARNING
Notification: Email + Slack
```

**What it detects:**
- Key accumulation
- Possible memory leak
- Need to optimize keys
- Capacity planning needed

**Alert Type 2: Rapid Key Growth (WARNING)**
```
Alert Name: "Redis - Rapid Key Growth"
Metric: redis.googleapis.com/stats/keyspace/keys_in_db
Condition: Increase > 20% in 15 minutes
Evaluation Window: 15 minutes
Severity: WARNING
Notification: Email + Slack
```

**What it detects:**
- Key accumulation issue
- Possible bug in application
- Early warning before memory issues

**Observability Use:**
- Track key count trends
- Identify key accumulation
- Capacity planning
- Optimize key management

---

## 14. EXPIRABLE KEYS IN DB PER NODE

### Why It's Important
- **TTL management**: Shows keys with expiration set
- **Memory management**: Helps track expirable vs permanent keys
- **Cache efficiency**: High expirable keys = good cache management
- **Data freshness**: TTLs ensure data freshness

### How It Works
- Counts keys with TTL (Time To Live) set
- **High expirable keys = Good**: Proper TTL management
- **Low expirable keys = Bad**: May indicate missing TTLs

### Alert Configuration

**Alert Type 1: Low Expirable Keys Ratio (WARNING)**
```
Alert Name: "Redis - Low Expirable Keys Ratio"
Metric: redis.googleapis.com/stats/keyspace/expirable_keys_ratio
Condition: (Expirable Keys / Total Keys) < threshold
  - Production: < 50%
  - Staging: < 40%
Evaluation Window: 30 minutes
Severity: WARNING
Notification: Email + Slack
```

**What it detects:**
- Missing TTLs on keys
- Possible memory leak
- Need to add TTLs to keys
- Cache management issues

**Observability Use:**
- Track TTL management
- Monitor expirable vs permanent keys
- Optimize cache TTLs
- Memory management

---

## 15. BYTES PENDING

### Why It's Important
- **Memory pressure**: Shows data waiting to be written
- **Performance indicator**: High pending bytes = I/O bottleneck
- **Replication lag**: In replication setups, shows replication lag
- **System health**: Indicates if system can keep up with writes

### How It Works
- Measures bytes waiting to be processed
- **Low/Zero = Good**: System keeping up
- **High = Bad**: System falling behind

### Alert Configuration

**Alert Type 1: High Bytes Pending (CRITICAL)**
```
Alert Name: "Redis - High Bytes Pending"
Metric: redis.googleapis.com/stats/memory/bytes_pending
Condition: Value > threshold
  - Production: > 100MB
  - Staging: > 50MB
Evaluation Window: 10 minutes
Severity: CRITICAL
Notification: PagerDuty + Email + Slack
```

**What it detects:**
- I/O bottleneck
- Replication lag
- System falling behind
- Need to investigate I/O performance

**Alert Type 2: Bytes Pending Growth (WARNING)**
```
Alert Name: "Redis - Bytes Pending Growth"
Metric: redis.googleapis.com/stats/memory/bytes_pending
Condition: Increase > 50MB in 10 minutes
Evaluation Window: 10 minutes
Severity: WARNING
Notification: Email + Slack
```

**What it detects:**
- Increasing I/O pressure
- Early warning before critical backlog
- Performance degradation

**Observability Use:**
- Track I/O performance
- Monitor replication lag
- Identify bottlenecks
- Performance optimization

---

## Summary: Alert Priority Matrix

### CRITICAL Alerts (PagerDuty + Email + Slack)
1. **High System Memory Usage > 85%** - Risk of OOM
2. **High Used Memory per Node > 80%** - Node memory pressure
3. **High Evicted Keys Rate > 1000/min** - Cache too small
4. **High Blocked Clients > 50** - Performance bottleneck
5. **Instance Restart Detected** - Availability issue
6. **Low Instance Availability < 90%** - Cluster degradation
7. **High Bytes Pending > 100MB** - I/O bottleneck
8. **High Latency p95 > 10ms** (Production) - Performance issue

### WARNING Alerts (Email + Slack)
1. **Low Cache Hit Ratio < 70%** - Cache inefficiency
2. **Rapid Memory Growth > 10%** - Memory leak warning
3. **High Connected Clients > 1000** - Connection issues
4. **High CPU Usage > 80%** - CPU bottleneck
5. **High Network Usage** - Traffic anomaly
6. **High Key Count > 10M** - Key accumulation
7. **Latency Spike > 200%** - Performance degradation

---

## Recommended Alert Configuration Summary

| Metric | Alert Type | Threshold | Severity | Evaluation Window |
|--------|-----------|-----------|----------|-------------------|
| Cache Hit Ratio | Low | < 70% | WARNING | 15 min |
| Cache Hit Ratio | Drop | > 20% decrease | WARNING | 15 min |
| System Memory Usage | High | > 85% | CRITICAL | 10 min |
| Used Memory per Node | High | > 80% of maxmemory | CRITICAL | 10 min |
| Evicted Keys Rate | High | > 1000/min | CRITICAL | 5 min |
| Connected Clients | High | > 1000 | WARNING | 10 min |
| Blocked Clients | High | > 50 | CRITICAL | 5 min |
| Instance Uptime | Restart | < 1 min | CRITICAL | 1 min |
| Latency p95 | High | > 10ms | CRITICAL | 5 min |
| Latency p95 | Spike | > 200% increase | WARNING | 5 min |
| Total Instances % | Low | < 90% | CRITICAL | 5 min |
| CPU Usage | High | > 80% | WARNING | 10 min |
| Network Usage | High | > 1GB/min | WARNING | 5 min |
| Keys in DB | High | > 10M per node | WARNING | 15 min |
| Bytes Pending | High | > 100MB | CRITICAL | 10 min |

---

## Key Takeaways

1. **Cache Hit Ratio is critical** - Primary performance indicator
2. **Memory metrics are essential** - System, used, and pending memory
3. **Evicted vs Expired keys are different** - Evicted = problem, Expired = normal
4. **Latency should use absolute values** - Use ms thresholds, not percent change for critical alerts
5. **Blocked clients indicate bottlenecks** - Critical for performance monitoring
6. **Instance availability is key** - Critical for SLA compliance
7. **All metrics serve both observability and alerting** - Use dashboards for context, alerts for action

---

## Answers to Your Questions

### Q1: For latency, is it good to have percent change or not?

**Answer:**
- **For critical alerts**: Use **ABSOLUTE VALUES** (milliseconds), not percent change
  - Example: `p95 latency > 10ms` (CRITICAL)
  - Why: Latency is measured in time units, absolute thresholds are clearer
- **For spike detection**: Use **PERCENT CHANGE** as additional warning
  - Example: `p95 latency increases > 200% in 5 minutes` (WARNING)
  - Why: Detects sudden performance degradation
- **Best Practice**: Use both - absolute threshold for critical alerts, percent change for spike detection

### Q2: In Evicted metrics, they gave two metrics same but why?

**Answer:**
- **Evicted Keys** and **Expired Keys** are **DIFFERENT metrics**:
  - **Evicted Keys**: Keys removed due to memory pressure (maxmemory policy) - **This is a problem**
  - **Expired Keys**: Keys removed due to TTL expiration - **This is normal operation**
- **Why both matter**:
  - **Evicted Keys**: Indicates cache is too small or misconfigured
  - **Expired Keys**: Shows proper TTL management
- **Alert on**: Evicted keys (problem), not expired keys (normal)

---

## Next Steps

1. **Set up dashboards** with all core metrics
2. **Configure critical alerts first** (Memory, Evicted Keys, Blocked Clients, Latency)
3. **Add warning alerts** for proactive monitoring
4. **Tune thresholds** based on baseline metrics over 1-2 weeks
5. **Create runbooks** for each alert type
6. **Review and adjust** monthly based on alert frequency and false positives

---

END OF DOCUMENT

