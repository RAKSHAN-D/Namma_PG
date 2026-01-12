# 🧵 Java Multithreading - Complete Guide from Scratch

## 📚 Table of Contents
1. [What is Multithreading?](#what-is-multithreading)
2. [Process vs Thread](#process-vs-thread)
3. [Thread Lifecycle](#thread-lifecycle)
4. [Creating Threads](#creating-threads)
5. [Thread Methods](#thread-methods)
6. [Synchronization](#synchronization)
7. [Inter-Thread Communication](#inter-thread-communication)
8. [Deadlock](#deadlock)
9. [Thread Pools & Executors](#thread-pools-executors)
10. [Best Practices](#best-practices)

---

## 🎯 What is Multithreading?

### **Simple Definition:**
**Multithreading** = Running multiple tasks **simultaneously** within a single program.

### **Real-World Analogy:**
```
Single-Threaded (One cook):
Cook → Chop vegetables → Cook rice → Make curry → Serve
(Sequentially, one at a time)

Multi-Threaded (Multiple cooks):
Cook 1 → Chop vegetables
Cook 2 → Cook rice        (All at the same time!)
Cook 3 → Make curry
```

### **Why Multithreading?**
1. ✅ **Better CPU usage** - Use multiple cores
2. ✅ **Faster execution** - Do multiple things simultaneously
3. ✅ **Better responsiveness** - UI doesn't freeze
4. ✅ **Resource sharing** - Threads share memory

### **Examples:**
```java
// Without Threading (Blocking)
downloadFile();      // Wait 10 seconds
processData();       // Wait 5 seconds
updateUI();          // Wait 1 second
// Total: 16 seconds

// With Threading (Concurrent)
Thread t1 = new Thread(() -> downloadFile());     // 10s
Thread t2 = new Thread(() -> processData());      // 5s
Thread t3 = new Thread(() -> updateUI());         // 1s

t1.start(); t2.start(); t3.start();
// Total: ~10 seconds (running simultaneously!)
```

---

## 🔄 Process vs Thread

### **What is a Process?**
A **process** is a **running program** with its own memory space.

### **What is a Thread?**
A **thread** is a **lightweight sub-process** within a program.

### **Key Differences:**

| Aspect | Process | Thread |
|--------|---------|--------|
| **Definition** | Running program | Lightweight sub-process |
| **Memory** | Separate memory | Shared memory |
| **Creation** | Heavy (slow) | Light (fast) |
| **Communication** | Inter-Process (complex) | Easy (shared memory) |
| **Crash Impact** | Isolated | Affects whole process |
| **Example** | Chrome, Word, Excel | Tabs in Chrome |

### **Visual:**
```
Computer (OS)
├── Process 1 (Chrome)
│   ├── Thread 1 (Tab 1)
│   ├── Thread 2 (Tab 2)
│   └── Thread 3 (Download)
├── Process 2 (Word)
│   ├── Thread 1 (Main editor)
│   ├── Thread 2 (Spell check)
│   └── Thread 3 (Auto-save)
└── Process 3 (Your Java App)
    ├── Thread 1 (Main - GUI)
    ├── Thread 2 (Database operations)
    └── Thread 3 (File processing)
```

### **In Java:**
```java
// Main thread - automatically created
public static void main(String[] args) {
    System.out.println("Running in: " + 
        Thread.currentThread().getName());
    // Output: Running in: main
}
```

---

## 🔄 Thread Lifecycle

### **Thread States:**

```
         NEW
          ↓
    (start() called)
          ↓
       RUNNABLE ←─────────────┐
          ↓                   │
    (Gets CPU time)          │
          ↓                   │
       RUNNING               │
          ↓                   │
   (Task complete)           │
          ↓                   │
     TERMINATED              │
                             │
    (sleep/wait/block) ──────┘
          ↓
    WAITING/BLOCKED
```

### **Detailed States:**

#### **1. NEW**
Thread created but not started

```java
Thread t = new Thread(() -> System.out.println("Hello"));
// State: NEW
```

#### **2. RUNNABLE**
Ready to run, waiting for CPU

```java
t.start();  // Now RUNNABLE
// Waiting for CPU scheduler
```

#### **3. RUNNING**
Actually executing

```java
// CPU selected this thread - RUNNING
System.out.println("I'm running!");
```

#### **4. WAITING/BLOCKED**
Temporarily paused

```java
Thread.sleep(1000);  // TIMED_WAITING
wait();              // WAITING
// Waiting for lock  // BLOCKED
```

#### **5. TERMINATED**
Finished execution

```java
// run() method completed
// Thread is DEAD - cannot restart!
```

### **Complete Example:**
```java
Thread t = new Thread(() -> {
    try {
        System.out.println("Running...");
        Thread.sleep(1000);  // TIMED_WAITING
        System.out.println("Done!");
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
});

System.out.println("State: " + t.getState());  // NEW
t.start();
System.out.println("State: " + t.getState());  // RUNNABLE
Thread.sleep(100);
System.out.println("State: " + t.getState());  // TIMED_WAITING
Thread.sleep(1000);
System.out.println("State: " + t.getState());  // TERMINATED
```

---

## 🚀 Creating Threads

### **Two Main Ways:**

1. **Extend Thread class**
2. **Implement Runnable interface** (Recommended)

---

### **Method 1: Extending Thread Class**

```java
// Step 1: Create class extending Thread
class MyThread extends Thread {
    
    @Override
    public void run() {
        // Task to run in thread
        for (int i = 1; i <= 5; i++) {
            System.out.println(Thread.currentThread().getName() + 
                              ": Count " + i);
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}

// Step 2: Create and start thread
public class ThreadDemo {
    public static void main(String[] args) {
        MyThread t1 = new MyThread();
        MyThread t2 = new MyThread();
        
        t1.setName("Thread-1");
        t2.setName("Thread-2");
        
        t1.start();  // Starts thread
        t2.start();  // Starts another thread
        
        // Both run simultaneously!
    }
}
```

**Output:**
```
Thread-1: Count 1
Thread-2: Count 1
Thread-1: Count 2
Thread-2: Count 2
...
(Order may vary - running concurrently!)
```

---

### **Method 2: Implementing Runnable (Better!)**

**Why Better?**
- ✅ Can extend other classes
- ✅ Better separation of task and thread
- ✅ More flexible

```java
// Step 1: Create class implementing Runnable
class MyTask implements Runnable {
    
    @Override
    public void run() {
        for (int i = 1; i <= 5; i++) {
            System.out.println(Thread.currentThread().getName() + 
                              ": Count " + i);
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}

// Step 2: Create Thread with Runnable
public class RunnableDemo {
    public static void main(String[] args) {
        MyTask task = new MyTask();
        
        Thread t1 = new Thread(task);
        Thread t2 = new Thread(task);
        
        t1.setName("Worker-1");
        t2.setName("Worker-2");
        
        t1.start();
        t2.start();
    }
}
```

---

### **Method 3: Lambda Expression (Java 8+)**

**Simplest way!**

```java
// One-liner thread creation
Thread t1 = new Thread(() -> {
    for (int i = 1; i <= 5; i++) {
        System.out.println("Count: " + i);
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
});

t1.start();
```

---

### **Method 4: Anonymous Class**

```java
Thread t = new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println("Running in anonymous thread!");
    }
});

t.start();
```

---

## 🛠️ Thread Methods

### **Important Thread Methods:**

| Method | Description | Example |
|--------|-------------|---------|
| `start()` | Start thread execution | `t.start()` |
| `run()` | Code to execute (don't call directly!) | Override this |
| `sleep(ms)` | Pause thread for milliseconds | `Thread.sleep(1000)` |
| `join()` | Wait for thread to finish | `t.join()` |
| `interrupt()` | Interrupt thread | `t.interrupt()` |
| `isAlive()` | Check if thread is running | `t.isAlive()` |
| `getName()` | Get thread name | `t.getName()` |
| `setName()` | Set thread name | `t.setName("Worker")` |
| `setPriority()` | Set thread priority (1-10) | `t.setPriority(5)` |
| `yield()` | Give CPU chance to other threads | `Thread.yield()` |

---

### **1. start() vs run()**

**IMPORTANT:** Never call `run()` directly!

```java
Thread t = new Thread(() -> System.out.println("Hello"));

// ✅ CORRECT - Creates new thread
t.start();  
// Output in new thread: Hello

// ❌ WRONG - Just calls method in main thread
t.run();
// Output in main thread: Hello (no multithreading!)
```

**Why?**
- `start()` → Creates new thread, calls `run()`
- `run()` → Just a normal method call

---

### **2. sleep() - Pause Execution**

```java
Thread t = new Thread(() -> {
    System.out.println("Starting...");
    
    try {
        Thread.sleep(2000);  // Sleep 2 seconds
    } catch (InterruptedException e) {
        System.out.println("Sleep interrupted!");
    }
    
    System.out.println("Done after 2 seconds!");
});

t.start();
```

**Important:**
- Must handle `InterruptedException`
- Thread releases CPU but **holds locks**
- Static method - affects current thread

---

### **3. join() - Wait for Completion**

**Without join():**
```java
Thread t = new Thread(() -> {
    for (int i = 1; i <= 5; i++) {
        System.out.println("Count: " + i);
    }
});

t.start();
System.out.println("Main thread continues!");
// Output order unpredictable!
```

**With join():**
```java
Thread t = new Thread(() -> {
    for (int i = 1; i <= 5; i++) {
        System.out.println("Count: " + i);
    }
});

t.start();
t.join();  // Main thread waits here!
System.out.println("Main thread continues!");
// Output: Count 1-5 THEN "Main thread continues"
```

**Real-World Example:**
```java
// Download thread
Thread download = new Thread(() -> {
    System.out.println("Downloading...");
    Thread.sleep(3000);
    System.out.println("Download complete!");
});

download.start();
download.join();  // Wait for download

// Process only after download complete
System.out.println("Processing downloaded file...");
```

---

### **4. interrupt() - Stop Thread**

```java
Thread t = new Thread(() -> {
    try {
        while (!Thread.interrupted()) {
            System.out.println("Working...");
            Thread.sleep(500);
        }
    } catch (InterruptedException e) {
        System.out.println("Interrupted! Cleaning up...");
    }
});

t.start();
Thread.sleep(2000);
t.interrupt();  // Stop the thread
```

---

### **5. Priority (1-10)**

```java
Thread t1 = new Thread(() -> System.out.println("Low priority"));
Thread t2 = new Thread(() -> System.out.println("High priority"));

t1.setPriority(Thread.MIN_PRIORITY);   // 1
t2.setPriority(Thread.MAX_PRIORITY);   // 10

t1.start();
t2.start();

// t2 has better chance of running first (not guaranteed!)
```

**Priority Levels:**
- `Thread.MIN_PRIORITY` = 1
- `Thread.NORM_PRIORITY` = 5 (default)
- `Thread.MAX_PRIORITY` = 10

---

## 🔒 Synchronization

### **The Problem: Race Condition**

**Without Synchronization:**
```java
class Counter {
    private int count = 0;
    
    public void increment() {
        count++;  // NOT thread-safe!
        // Actually 3 operations:
        // 1. Read count
        // 2. Add 1
        // 3. Write back
    }
    
    public int getCount() {
        return count;
    }
}

public class RaceCondition {
    public static void main(String[] args) throws InterruptedException {
        Counter counter = new Counter();
        
        // 2 threads incrementing 1000 times each
        Thread t1 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) {
                counter.increment();
            }
        });
        
        Thread t2 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) {
                counter.increment();
            }
        });
        
        t1.start();
        t2.start();
        
        t1.join();
        t2.join();
        
        System.out.println("Count: " + counter.getCount());
        // Expected: 2000
        // Actual: Maybe 1823, 1956, etc. (WRONG!)
    }
}
```

**Why Wrong?**
```
Time | Thread 1      | Thread 2      | count value
-----|---------------|---------------|------------
1    | Read (0)      |               | 0
2    |               | Read (0)      | 0
3    | Add 1 (0+1)   |               | 0
4    |               | Add 1 (0+1)   | 0
5    | Write (1)     |               | 1
6    |               | Write (1)     | 1  ← Should be 2!
```

---

### **Solution: Synchronized Keyword**

#### **Method 1: Synchronized Method**

```java
class Counter {
    private int count = 0;
    
    // synchronized = only one thread at a time
    public synchronized void increment() {
        count++;  // Now thread-safe!
    }
    
    public synchronized int getCount() {
        return count;
    }
}

// Usage:
Counter counter = new Counter();

Thread t1 = new Thread(() -> {
    for (int i = 0; i < 1000; i++) {
        counter.increment();
    }
});

Thread t2 = new Thread(() -> {
    for (int i = 0; i < 1000; i++) {
        counter.increment();
    }
});

t1.start(); t2.start();
t1.join(); t2.join();

System.out.println("Count: " + counter.getCount());
// Output: 2000 (CORRECT!)
```

---

#### **Method 2: Synchronized Block**

**More flexible - lock only critical section**

```java
class Counter {
    private int count = 0;
    private Object lock = new Object();
    
    public void increment() {
        // Non-critical code here (parallel)
        
        synchronized(lock) {  // Lock only this part
            count++;  // Critical section
        }
        
        // More non-critical code (parallel)
    }
}
```

**Comparison:**
```java
// Synchronized method - locks entire method
public synchronized void method() {
    // All code locked
}

// Synchronized block - locks only part
public void method() {
    // This runs in parallel
    
    synchronized(this) {
        // Only this is locked
    }
    
    // This runs in parallel
}
```

---

### **Static Synchronization**

```java
class Counter {
    private static int count = 0;
    
    // Locks the class (not instance)
    public static synchronized void increment() {
        count++;
    }
}

// Or use class lock:
synchronized(Counter.class) {
    // Code
}
```

---

### **Real-World Example: Bank Account**

```java
class BankAccount {
    private double balance = 1000;
    
    // Synchronized - prevent concurrent withdrawals
    public synchronized void withdraw(double amount) {
        if (balance >= amount) {
            System.out.println(Thread.currentThread().getName() + 
                              " withdrawing " + amount);
            
            // Simulate processing time
            try { Thread.sleep(100); } 
            catch (InterruptedException e) {}
            
            balance -= amount;
            System.out.println("Balance: " + balance);
        } else {
            System.out.println("Insufficient funds!");
        }
    }
    
    public synchronized double getBalance() {
        return balance;
    }
}

// Usage:
BankAccount account = new BankAccount();

Runnable task = () -> {
    account.withdraw(600);
};

Thread t1 = new Thread(task, "Person-1");
Thread t2 = new Thread(task, "Person-2");

t1.start();
t2.start();

// Output:
// Person-1 withdrawing 600
// Balance: 400
// Insufficient funds!  ← Person-2 correctly blocked!
```

---

## 💬 Inter-Thread Communication

### **Methods: wait(), notify(), notifyAll()**

**Must be called inside synchronized block!**

| Method | Description |
|--------|-------------|
| `wait()` | Release lock and wait |
| `notify()` | Wake up one waiting thread |
| `notifyAll()` | Wake up all waiting threads |

---

### **Producer-Consumer Problem**

**Classic example of thread communication**

```java
class SharedResource {
    private int data;
    private boolean hasData = false;
    
    // Producer puts data
    public synchronized void produce(int value) {
        while (hasData) {
            try {
                wait();  // Wait if data not consumed
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        
        this.data = value;
        hasData = true;
        System.out.println("Produced: " + value);
        notify();  // Wake up consumer
    }
    
    // Consumer gets data
    public synchronized int consume() {
        while (!hasData) {
            try {
                wait();  // Wait if no data
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        
        hasData = false;
        System.out.println("Consumed: " + data);
        notify();  // Wake up producer
        return data;
    }
}

// Usage:
SharedResource resource = new SharedResource();

// Producer thread
Thread producer = new Thread(() -> {
    for (int i = 1; i <= 5; i++) {
        resource.produce(i);
        try { Thread.sleep(100); } 
        catch (InterruptedException e) {}
    }
});

// Consumer thread
Thread consumer = new Thread(() -> {
    for (int i = 1; i <= 5; i++) {
        resource.consume();
        try { Thread.sleep(150); } 
        catch (InterruptedException e) {}
    }
});

producer.start();
consumer.start();

// Output:
// Produced: 1
// Consumed: 1
// Produced: 2
// Consumed: 2
// ...
```

---

## 💀 Deadlock

### **What is Deadlock?**
Two or more threads waiting for each other forever!

### **Example:**
```
Thread 1 holds Lock A, wants Lock B
Thread 2 holds Lock B, wants Lock A
↓
Both waiting forever! 💀
```

### **Deadlock Code Example:**

```java
class DeadlockDemo {
    private final Object lock1 = new Object();
    private final Object lock2 = new Object();
    
    public void method1() {
        synchronized(lock1) {
            System.out.println("Thread 1: Holding lock1...");
            
            try { Thread.sleep(100); } 
            catch (InterruptedException e) {}
            
            System.out.println("Thread 1: Waiting for lock2...");
            synchronized(lock2) {
                System.out.println("Thread 1: Holding lock1 & lock2");
            }
        }
    }
    
    public void method2() {
        synchronized(lock2) {
            System.out.println("Thread 2: Holding lock2...");
            
            try { Thread.sleep(100); } 
            catch (InterruptedException e) {}
            
            System.out.println("Thread 2: Waiting for lock1...");
            synchronized(lock1) {
                System.out.println("Thread 2: Holding lock1 & lock2");
            }
        }
    }
    
    public static void main(String[] args) {
        DeadlockDemo demo = new DeadlockDemo();
        
        new Thread(() -> demo.method1()).start();
        new Thread(() -> demo.method2()).start();
        
        // Output:
        // Thread 1: Holding lock1...
        // Thread 2: Holding lock2...
        // Thread 1: Waiting for lock2...
        // Thread 2: Waiting for lock1...
        // (DEADLOCK! Program hangs forever)
    }
}
```

---

### **How to Avoid Deadlock?**

#### **Solution 1: Consistent Lock Ordering**

```java
// ✅ CORRECT - Always lock in same order
public void method1() {
    synchronized(lock1) {  // First lock1
        synchronized(lock2) {  // Then lock2
            // Code
        }
    }
}

public void method2() {
    synchronized(lock1) {  // First lock1 (SAME ORDER!)
        synchronized(lock2) {  // Then lock2
            // Code
        }
    }
}
```

#### **Solution 2: Use tryLock() with timeout**

```java
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

Lock lock1 = new ReentrantLock();
Lock lock2 = new ReentrantLock();

// Try to acquire lock with timeout
if (lock1.tryLock(1, TimeUnit.SECONDS)) {
    try {
        if (lock2.tryLock(1, TimeUnit.SECONDS)) {
            try {
                // Do work
            } finally {
                lock2.unlock();
            }
        }
    } finally {
        lock1.unlock();
    }
} else {
    System.out.println("Could not acquire locks, trying again...");
}
```

#### **Solution 3: Avoid nested locks**

```java
// ✅ Better - No nested locks
public void method1() {
    synchronized(lock1) {
        // Do work with lock1
    }
    
    synchronized(lock2) {
        // Do work with lock2
    }
}
```

---

## 🏊 Thread Pools & Executors

### **Why Thread Pools?**

**Without Thread Pool:**
```java
// Creating 1000 threads!
for (int i = 0; i < 1000; i++) {
    new Thread(() -> doWork()).start();
}
// Problems:
// - Too many threads created
// - High memory usage
// - Slow creation/destruction
// - Hard to manage
```

**With Thread Pool:**
```java
// Reuse 10 threads for 1000 tasks
ExecutorService executor = Executors.newFixedThreadPool(10);

for (int i = 0; i < 1000; i++) {
    executor.submit(() -> doWork());
}

executor.shutdown();
// Benefits:
// - Only 10 threads
// - Reused efficiently
// - Better performance
// - Easy management
```

---

### **Types of Thread Pools:**

```java
// 1. Fixed Thread Pool - Fixed number of threads
ExecutorService executor = Executors.newFixedThreadPool(5);
// Pool of 5 threads

// 2. Cached Thread Pool - Creates threads as needed
ExecutorService executor = Executors.newCachedThreadPool();
// Creates new threads when needed, reuses idle threads

// 3. Single Thread Executor - One thread only
ExecutorService executor = Executors.newSingleThreadExecutor();
// Sequential execution with one thread

// 4. Scheduled Thread Pool - For scheduled tasks
ScheduledExecutorService executor = Executors.newScheduledThreadPool(3);
// Run tasks with delay or periodically
```

---

### **Using Executors:**

```java
import java.util.concurrent.*;

public class ExecutorExample {
    public static void main(String[] args) {
        // Create thread pool with 3 threads
        ExecutorService executor = Executors.newFixedThreadPool(3);
        
        // Submit 10 tasks
        for (int i = 1; i <= 10; i++) {
            int taskId = i;
            executor.submit(() -> {
                System.out.println("Task " + taskId + 
                    " executed by " + Thread.currentThread().getName());
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            });
        }
        
        // Shutdown executor
        executor.shutdown();  // No new tasks accepted
        
        try {
            // Wait for all tasks to complete
            if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {
                executor.shutdownNow();  // Force shutdown
            }
        } catch (InterruptedException e) {
            executor.shutdownNow();
        }
        
        System.out.println("All tasks completed!");
    }
}
```

---

### **Callable and Future**

**Runnable vs Callable:**

| Runnable | Callable |
|----------|----------|
| No return value | Returns a value |
| Cannot throw checked exceptions | Can throw exceptions |
| `void run()` | `V call()` |

```java
import java.util.concurrent.*;

// Callable - returns a value
Callable<Integer> task = () -> {
    Thread.sleep(1000);
    return 42;  // Return value
};

ExecutorService executor = Executors.newSingleThreadExecutor();

// Submit callable - returns Future
Future<Integer> future = executor.submit(task);

// Do other work while task runs
System.out.println("Task submitted, doing other work...");

// Get result (blocks until ready)
Integer result = future.get();  // Waits for result
System.out.println("Result: " + result);  // 42

executor.shutdown();
```

**Future Methods:**
```java
Future<Integer> future = executor.submit(callable);

// Check if done
boolean isDone = future.isDone();

// Cancel task
future.cancel(true);

// Get with timeout
Integer result = future.get(5, TimeUnit.SECONDS);
```

---

### **Complete Example: Parallel File Processing**

```java
import java.util.concurrent.*;
import java.util.*;

public class ParallelFileProcessor {
    
    public static void main(String[] args) throws Exception {
        // Files to process
        List<String> files = Arrays.asList(
            "file1.txt", "file2.txt", "file3.txt", 
            "file4.txt", "file5.txt"
        );
        
        // Create thread pool
        ExecutorService executor = Executors.newFixedThreadPool(3);
        
        // List to hold futures
        List<Future<Integer>> futures = new ArrayList<>();
        
        // Submit tasks
        for (String file : files) {
            Callable<Integer> task = () -> {
                System.out.println("Processing " + file + 
                    " by " + Thread.currentThread().getName());
                Thread.sleep(1000);  // Simulate processing
                return file.length();  // Return file length
            };
            
            Future<Integer> future = executor.submit(task);
            futures.add(future);
        }
        
        // Get results
        int totalLength = 0;
        for (int i = 0; i < futures.size(); i++) {
            Integer length = futures.get(i).get();
            System.out.println(files.get(i) + " length: " + length);
            totalLength += length;
        }
        
        System.out.println("Total length: " + totalLength);
        
        executor.shutdown();
    }
}
```

---

## 📋 Best Practices

### **✅ DO:**

1. **Use Executors instead of raw threads**
```java
// ✅ Good
ExecutorService executor = Executors.newFixedThreadPool(10);
executor.submit(() -> doWork());

// ❌ Avoid
new Thread(() -> doWork()).start();
```

2. **Always shutdown executors**
```java
executor.shutdown();
try {
    if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {
        executor.shutdownNow();
    }
} catch (InterruptedException e) {
    executor.shutdownNow();
}
```

3. **Use thread-safe collections**
```java
// Thread-safe
List<String> list = new CopyOnWriteArrayList<>();
Map<String, String> map = new ConcurrentHashMap<>();
Queue<String> queue = new ConcurrentLinkedQueue<>();
```

4. **Name your threads**
```java
Thread t = new Thread(() -> doWork(), "Worker-1");
// Easier debugging!
```

5. **Handle InterruptedException properly**
```java
try {
    Thread.sleep(1000);
} catch (InterruptedException e) {
    // Restore interrupt status
    Thread.currentThread().interrupt();
    // Or handle appropriately
}
```

---

### **❌ DON'T:**

1. **Don't call run() directly**
```java
// ❌ Wrong
thread.run();  // Just method call, no new thread!

// ✅ Correct
thread.start();  // Creates new thread
```

2. **Don't synchronize on String or BoxedType**
```java
// ❌ Dangerous
synchronized("lock") { }  // String literals are interned!

// ✅ Safe
synchronized(new Object()) { }
```

3. **Don't hold locks for too long**
```java
// ❌ Bad
synchronized(lock) {
    // Long database operation
    // Network call
    // File I/O
}

// ✅ Better
// Do I/O outside lock
synchronized(lock) {
    // Only critical operations
}
```

4. **Don't ignore InterruptedException**
```java
// ❌ Bad
catch (InterruptedException e) {
    // Swallow exception
}

// ✅ Good
catch (InterruptedException e) {
    Thread.currentThread().interrupt();
    logger.error("Thread interrupted", e);
}
```

---

## 🎯 Real-World Complete Example

### **Web Server Request Handler**

```java
import java.util.concurrent.*;
import java.util.*;

class Request {
    private String id;
    private String data;
    
    public Request(String id, String data) {
        this.id = id;
        this.data = data;
    }
    
    public String getId() { return id; }
    public String getData() { return data; }
}

class RequestHandler implements Callable<String> {
    private Request request;
    
    public RequestHandler(Request request) {
        this.request = request;
    }
    
    @Override
    public String call() throws Exception {
        System.out.println("Processing request " + request.getId() + 
            " by " + Thread.currentThread().getName());
        
        // Simulate processing
        Thread.sleep(1000);
        
        return "Response for " + request.getId();
    }
}

public class WebServer {
    private ExecutorService executor;
    
    public WebServer(int threadPoolSize) {
        this.executor = Executors.newFixedThreadPool(threadPoolSize);
    }
    
    public Future<String> handleRequest(Request request) {
        return executor.submit(new RequestHandler(request));
    }
    
    public void shutdown() {
        executor.shutdown();
        try {
            if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {
                executor.shutdownNow();
            }
        } catch (InterruptedException e) {
            executor.shutdownNow();
        }
    }
    
    public static void main(String[] args) throws Exception {
        // Create server with 5 worker threads
        WebServer server = new WebServer(5);
        
        // Simulate 20 requests
        List<Future<String>> futures = new ArrayList<>();
        for (int i = 1; i <= 20; i++) {
            Request request = new Request("REQ-" + i, "Data " + i);
            Future<String> future = server.handleRequest(request);
            futures.add(future);
        }
        
        // Get all responses
        for (Future<String> future : futures) {
            String response = future.get();
            System.out.println("Got: " + response);
        }
        
        // Shutdown server
        server.shutdown();
        System.out.println("Server shutdown complete!");
    }
}
```

---

## 🎓 Summary

### **Key Concepts:**

1. **Thread** = Lightweight sub-process
2. **Process** = Heavy program with separate memory
3. **Multithreading** = Multiple threads running simultaneously
4. **Synchronization** = Prevent race conditions
5. **Deadlock** = Threads waiting for each other forever
6. **Thread Pool** = Reuse threads efficiently
7. **Executor** = Manage threads easily
8. **Callable** = Thread that returns a value
9. **Future** = Result of async computation

### **Thread Lifecycle:**
```
NEW → RUNNABLE → RUNNING → TERMINATED
         ↓           ↑
    WAITING/BLOCKED ─┘
```

### **Creation Methods:**
1. Extend Thread class
2. Implement Runnable interface (better!)
3. Lambda expression (simplest!)
4. Executors (best for production!)

### **Synchronization:**
- `synchronized` keyword
- Prevents race conditions
- Can cause deadlock if not careful

### **Best Practice:**
Use **Executors** with thread pools for production code!

---

## 🚀 Practice Exercises

1. Create a multi-threaded download manager
2. Implement producer-consumer with 5 producers and 3 consumers
3. Build a thread pool that processes 100 tasks with 10 threads
4. Create a bank account with concurrent deposit/withdraw operations
5. Implement a web crawler using thread pools

**Happy Multithreading! 🧵**
