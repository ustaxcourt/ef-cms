# 1. State Management Migration - Overview

## Context

Our React frontend uses Cerebral.js for state management and workflow orchestration. Cerebral is no longer maintained and lacks support for React 19.x. We need to migrate away from it. See [10462](https://github.com/flexion/ef-cms/issues/10462).

## Goal

*Design a simple, scalable, and maintainable state management module that keeps React components bereft of business logic and independent of dependencies, including anything tightly coupled to React itself.*

## Current Usage

As described in [2a. Overview of Current Architecture](./2-technical-analysis/a-current-architecture.md), Cerebral serves three main purposes in our application:

1. Global state management through a single state tree
2. Computed/derived state calculations
3. Workflow orchestration via sequences and actions

Our codebase currently contains nearly 2,000 files that are tightly coupled to Cerebral.

## Key Challenges

1. **Tight Coupling**: Components, business logic, and state management are tightly coupled to Cerebral's specific APIs and patterns.

2. **Complex Workflows**: Business processes are modeled using Cerebral's sequence/action pattern. Moving to another library means either:
   - Rewriting these workflows in a new library's paradigm
   - Creating an adapter that maintains similar patterns

3. **Scale**: The number of files requiring changes makes a direct migration risky and time-consuming.

## Possible Approaches

### 1. Direct Migration
Completely replace Cerebral with one or more modern libraries. Requires rewriting all sequences, actions, and connected components. This approach involves migrating away from Cerebral both conceptually and technically.

**Pros**:
- Clean break from legacy code
- Better TypeScript support

**Cons**:
- Massive undertaking
- High risk of bugs
- Requires extensive testing
- Long development timeline

### 2. Compatibility Layer
Build an adapter that implements Cerebral's API using modern libraries underneath. This approach maintains Cerebral's API conceptually while modernizing its underlying implementation.

**Pros**:
- Minimal changes to existing code
- Can migrate incrementally
- Lower risk
- Faster implementation

**Cons**:
- Technical debt from maintaining compatibility layer
- Risk of hidden complexity in synchronizing state and behavior between the compatibility layer and the modern libraries underneath
- May limit ability to use new library features
- Additional abstraction layer to maintain

### 3. Fork Maintenance
Fork Cerebral and maintain it ourselves.

**Pros**:
- Minimal code changes required
- Can add React 19.x support directly
- Complete control over the library

**Cons**:
- Long-term maintenance burden
- Still stuck with Cerebral's limitations
- Need to implement improved TypeScript support ourselves
