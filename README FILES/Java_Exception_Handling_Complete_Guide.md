# ☕ Java Exception Handling - Complete Guide

## 📚 Table of Contents
1. [What is Exception Handling?](#what-is-exception-handling)
2. [Exception Hierarchy](#exception-hierarchy)
3. [Types of Exceptions](#types-of-exceptions)
4. [Errors vs Exceptions](#errors-vs-exceptions)
5. [Try-Catch-Finally](#try-catch-finally)
6. [Throw vs Throws](#throw-vs-throws)
7. [Custom Exceptions](#custom-exceptions)
8. [Stack Traces & Debugging](#stack-traces-debugging)
9. [Best Practices](#best-practices)

---

## 🎯 What is Exception Handling?

### **Simple Definition:**
An **exception** is an **unexpected event** that happens during program execution that disrupts the normal flow of the program.

### **Real-World Example:**
```
You're driving a car (program running)
↓
Suddenly, a tire bursts (exception occurs)
↓
You pull over safely (exception handling)
vs
You crash (program crash without handling)
```

### **Why Exception Handling?**
1. ✅ **Prevent program crash**
2. ✅ **Recover from errors gracefully**
3. ✅ **Provide meaningful error messages**
4. ✅ **Maintain program flow**
5. ✅ **Debug easily with stack traces**

---

## 🌳 Exception Hierarchy

### **The Complete Hierarchy:**
```
                    Object
                      ↓
                  Throwable
                 /          \
            Error          Exception
           /    \         /         \
    OutOfMemory Stack   IO        Runtime
      Error    Overflow Exception Exception
              Error              /      \
                           Null    Arithmetic
                          Pointer  Exception
                          Exception
```

### **Key Classes:**

#### **1. Throwable** (Grandfather)
- **Root of all exceptions and errors**
- Only objects that extend Throwable can be thrown
- Has two children: Error and Exception

```java
// You can catch Throwable (but it's not recommended)
try {
    // code
} catch (Throwable t) {
    // Catches EVERYTHING (errors + exceptions)
}
```

#### **2. Error** (Child of Throwable)
- **Serious problems** that application shouldn't try to catch
- Usually indicates system/JVM problems
- Examples: OutOfMemoryError, StackOverflowError

#### **3. Exception** (Child of Throwable)
- **Problems that can be caught and handled**
- Application should handle these
- Has two types:
  - **Checked Exceptions** (compile-time)
  - **Unchecked Exceptions** (runtime)

#### **4. RuntimeException** (Child of Exception)
- **Unchecked exceptions**
- Happen during program execution
- Examples: NullPointerException, ArrayIndexOutOfBoundsException

---

## 📊 Types of Exceptions

### **Two Main Types:**

| Type | Checked | When Checked | Must Handle? | Example |
|------|---------|--------------|--------------|---------|
| **Checked** | ✅ | Compile-time | YES | IOException, SQLException |
| **Unchecked** | ❌ | Runtime | NO (optional) | NullPointerException, ArithmeticException |

---

### **1. Checked Exceptions (Compile-Time)**

**Definition:** Exceptions that compiler **forces you to handle**

**Why "Checked"?** Compiler checks if you've handled them

**Examples:**
```java
// IOException - File might not exist
public void readFile(String path) throws IOException {
    FileReader fr = new FileReader(path);  // Checked exception!
    // Compiler error if you don't handle or declare throws
}

// SQLException - Database might be down
public void queryDB() throws SQLException {
    Connection conn = DriverManager.getConnection(url);
    // Must handle or declare throws
}

// ClassNotFoundException - Class might not be found
public void loadClass(String name) throws ClassNotFoundException {
    Class.forName(name);  // Checked exception
}
```

**How to Handle:**
```java
// Option 1: Try-Catch (Handle it yourself)
public void readFile(String path) {
    try {
        FileReader fr = new FileReader(path);
    } catch (IOException e) {
        System.out.println("File not found!");
    }
}

// Option 2: Throws (Duck it - let caller handle)
public void readFile(String path) throws IOException {
    FileReader fr = new FileReader(path);
}
```

---

### **2. Unchecked Exceptions (Runtime)**

**Definition:** Exceptions that occur **during program execution**

**Why "Unchecked"?** Compiler doesn't force you to handle

**Extend:** `RuntimeException` class

**Examples:**
```java
// 1. NullPointerException - Accessing null object
String str = null;
str.length();  // NullPointerException at runtime!

// 2. ArithmeticException - Division by zero
int result = 10 / 0;  // ArithmeticException!

// 3. ArrayIndexOutOfBoundsException - Invalid array index
int[] arr = {1, 2, 3};
int x = arr[5];  // ArrayIndexOutOfBoundsException!

// 4. NumberFormatException - Invalid number format
int num = Integer.parseInt("abc");  // NumberFormatException!

// 5. ClassCastException - Invalid type casting
Object obj = "Hello";
Integer num = (Integer) obj;  // ClassCastException!
```

**Handling is Optional:**
```java
// You CAN handle them
try {
    int result = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero!");
}

// Or you can let them crash (not recommended)
int result = 10 / 0;  // Program crashes
```

---

## ⚠️ Errors vs Exceptions

### **What is an Error?**
**Error** = Serious problem that application **should NOT try to catch**

### **Key Differences:**

| Aspect | Exception | Error |
|--------|-----------|-------|
| **Severity** | Recoverable | Serious/Fatal |
| **Caused By** | Program logic | System/JVM issues |
| **Should Catch?** | YES | NO |
| **Can Recover?** | Usually YES | Usually NO |
| **Examples** | IOException, SQLException | OutOfMemoryError, StackOverflowError |

---

### **Common Errors:**

#### **1. StackOverflowError**
**Cause:** Too many method calls (infinite recursion)

```java
// StackOverflowError Example
public void recursiveMethod() {
    recursiveMethod();  // Infinite recursion!
    // No base case to stop
}

// Each call adds to stack:
// recursiveMethod()
//   ↓ recursiveMethod()
//     ↓ recursiveMethod()
//       ↓ recursiveMethod()
//         ↓ ... (millions more)
//           ↓ STACK OVERFLOW! 💥
```

**Why it happens:**
- Every method call is stored in the **stack**
- Stack has limited memory
- Too many calls → Stack full → Error!

**Fix:**
```java
// Add base case
public void recursiveMethod(int count) {
    if (count == 0) return;  // Base case - stops recursion
    recursiveMethod(count - 1);
}
```

---

#### **2. OutOfMemoryError**
**Cause:** Application runs out of memory

```java
// OutOfMemoryError Example
List<String> list = new ArrayList<>();
while (true) {
    list.add("More data");  // Keep adding until memory full
}
// Eventually: OutOfMemoryError! 💥
```

**Why it happens:**
- Java Heap memory is limited
- Creating too many objects
- Not releasing objects (memory leak)

**Fix:**
```java
// Remove unused objects
list.clear();  // Remove objects

// Or increase heap size
// java -Xmx512m MyApp  (512 MB heap)
```

---

### **Runtime Errors vs Runtime Exceptions**

**They are DIFFERENT!**

| Aspect | Runtime Error | Runtime Exception |
|--------|---------------|-------------------|
| **Class** | Extends `Error` | Extends `RuntimeException` |
| **Severity** | Fatal | Recoverable |
| **Example** | StackOverflowError | NullPointerException |
| **Should Catch?** | NO | YES (optional) |
| **Can Fix?** | Usually system issue | Fix code logic |

```java
// Runtime ERROR (don't catch)
try {
    // Infinite recursion
} catch (StackOverflowError e) {  // ❌ Bad practice
    // Can't really recover from this
}

// Runtime EXCEPTION (should catch)
try {
    int result = 10 / 0;
} catch (ArithmeticException e) {  // ✅ Good practice
    System.out.println("Fixed: Cannot divide by zero");
}
```

---

## 🛡️ Try-Catch-Finally

### **Basic Syntax:**
```java
try {
    // Code that might throw exception
} catch (ExceptionType e) {
    // Handle exception
} finally {
    // Always executes (cleanup code)
}
```

---

### **1. Try Block**
**Purpose:** Contains risky code

```java
try {
    int result = 10 / 0;  // Risky operation
    System.out.println("This won't print");
}
```

---

### **2. Catch Block**
**Purpose:** Handle the exception

#### **Single Catch:**
```java
try {
    int result = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("Error: " + e.getMessage());
}
```

#### **Multiple Catch Blocks:**
```java
try {
    String str = null;
    str.length();  // NullPointerException
    int result = 10 / 0;  // ArithmeticException
} catch (NullPointerException e) {
    System.out.println("Null value!");
} catch (ArithmeticException e) {
    System.out.println("Math error!");
} catch (Exception e) {  // Generic catch - catches anything
    System.out.println("Something went wrong!");
}
```

**Order Matters!** (Specific → Generic)
```java
// ✅ CORRECT (specific first)
try {
    // code
} catch (ArithmeticException e) {  // Specific
    // handle
} catch (Exception e) {  // Generic (parent)
    // handle
}

// ❌ WRONG (generic first)
try {
    // code
} catch (Exception e) {  // Generic first - catches everything!
    // This catches ALL exceptions
} catch (ArithmeticException e) {  // Unreachable! Compile error!
    // Never executes
}
```

#### **Multi-Catch (Java 7+):**
```java
try {
    // code
} catch (IOException | SQLException e) {
    // Handle both with same code
    System.out.println("Database or File error!");
}
```

---

### **3. Finally Block**
**Purpose:** Always executes (cleanup)

**Executes even if:**
- ✅ No exception occurs
- ✅ Exception occurs and caught
- ✅ Exception occurs but not caught
- ✅ Return statement in try/catch
- ❌ Only doesn't execute if JVM exits (System.exit())

```java
// Example: Closing resources
FileReader fr = null;
try {
    fr = new FileReader("file.txt");
    // Read file
} catch (IOException e) {
    System.out.println("Error reading file");
} finally {
    // Always close the file
    if (fr != null) {
        try {
            fr.close();  // Cleanup
        } catch (IOException e) {
            System.out.println("Error closing file");
        }
    }
}
```

**Execution Flow:**
```java
try {
    System.out.println("1. Try");
    return;  // Returns after finally!
} catch (Exception e) {
    System.out.println("2. Catch");
} finally {
    System.out.println("3. Finally");  // Executes before return!
}

// Output:
// 1. Try
// 3. Finally
// (then returns)
```

---

## 🎯 Throw vs Throws

### **Comparison Table:**

| Aspect | throw | throws |
|--------|-------|--------|
| **Used For** | Throw an exception | Declare possible exceptions |
| **Location** | Inside method body | Method signature |
| **Usage** | `throw new Exception()` | `void method() throws Exception` |
| **Purpose** | Actually throw exception | Tell caller to handle |
| **Multiple?** | One at a time | Can declare multiple |

---

### **1. throw Keyword**

**Purpose:** **Throw an exception** explicitly

**Syntax:** `throw new ExceptionType("message");`

**Examples:**

#### **Throw RuntimeException:**
```java
public void setAge(int age) {
    if (age < 0) {
        throw new IllegalArgumentException("Age cannot be negative!");
        // Throws exception immediately
    }
    this.age = age;
}

// Usage:
setAge(-5);  // IllegalArgumentException thrown! 💥
```

#### **Throw Checked Exception:**
```java
public void withdraw(double amount) throws InsufficientFundsException {
    if (amount > balance) {
        throw new InsufficientFundsException("Not enough money!");
        // Must declare in method signature
    }
    balance -= amount;
}
```

#### **Rethrowing Exception:**
```java
public void processFile() throws IOException {
    try {
        FileReader fr = new FileReader("file.txt");
    } catch (IOException e) {
        System.out.println("Logging error: " + e.getMessage());
        throw e;  // Rethrow to caller
    }
}
```

---

### **2. throws Keyword**

**Purpose:** **Declare** that method might throw exceptions

**Syntax:** `returnType methodName() throws Exception1, Exception2`

**Examples:**

#### **Single Exception:**
```java
public void readFile(String path) throws IOException {
    FileReader fr = new FileReader(path);
    // Might throw IOException - declared in signature
}
```

#### **Multiple Exceptions:**
```java
public void connectDB(String url) throws SQLException, ClassNotFoundException {
    Class.forName("com.mysql.Driver");  // ClassNotFoundException
    Connection conn = DriverManager.getConnection(url);  // SQLException
}
```

#### **Ducking Exceptions:**
```java
// Method A throws exception
public void methodA() throws IOException {
    throw new IOException("Error in A");
}

// Method B ducks it (doesn't handle, just declares)
public void methodB() throws IOException {
    methodA();  // Duck - let caller handle
}

// Method C must handle
public void methodC() {
    try {
        methodB();  // Must catch now
    } catch (IOException e) {
        System.out.println("Finally handling it!");
    }
}
```

---

## 🎨 Custom Exceptions

### **Why Create Custom Exceptions?**
1. ✅ **Domain-specific errors** (InsufficientFundsException)
2. ✅ **Better error messages**
3. ✅ **Easier debugging**
4. ✅ **Clean code organization**

---

### **How to Create:**

#### **Step 1: Extend Exception Class**

**For Checked Exception:**
```java
// Extends Exception → Checked exception
public class InsufficientFundsException extends Exception {
    
    // Constructor with message
    public InsufficientFundsException(String message) {
        super(message);  // Pass to parent
    }
    
    // Constructor with message and cause
    public InsufficientFundsException(String message, Throwable cause) {
        super(message, cause);
    }
}
```

**For Unchecked Exception:**
```java
// Extends RuntimeException → Unchecked exception
public class InvalidAgeException extends RuntimeException {
    
    private int age;
    
    public InvalidAgeException(String message, int age) {
        super(message);
        this.age = age;
    }
    
    public int getAge() {
        return age;
    }
}
```

---

#### **Step 2: Use Custom Exception**

```java
// Bank Account Class
public class BankAccount {
    private double balance;
    
    // Throw custom exception
    public void withdraw(double amount) throws InsufficientFundsException {
        if (amount > balance) {
            throw new InsufficientFundsException(
                "Cannot withdraw $" + amount + 
                ". Only $" + balance + " available."
            );
        }
        balance -= amount;
    }
    
    public void setAge(int age) {
        if (age < 0 || age > 150) {
            throw new InvalidAgeException("Invalid age: " + age, age);
        }
        this.age = age;
    }
}

// Usage:
BankAccount account = new BankAccount();
account.deposit(100);

try {
    account.withdraw(200);  // Throws InsufficientFundsException
} catch (InsufficientFundsException e) {
    System.out.println("Error: " + e.getMessage());
    // Error: Cannot withdraw $200. Only $100 available.
}
```

---

### **Best Practices for Custom Exceptions:**

```java
public class UserNotFoundException extends Exception {
    
    private String userId;
    
    // Constructor 1: Message only
    public UserNotFoundException(String message) {
        super(message);
    }
    
    // Constructor 2: Message + userId
    public UserNotFoundException(String message, String userId) {
        super(message);
        this.userId = userId;
    }
    
    // Constructor 3: Message + cause
    public UserNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
    
    // Constructor 4: Full details
    public UserNotFoundException(String message, String userId, Throwable cause) {
        super(message, cause);
        this.userId = userId;
    }
    
    // Getter for additional data
    public String getUserId() {
        return userId;
    }
    
    // Custom toString for better debugging
    @Override
    public String toString() {
        return "UserNotFoundException: " + getMessage() + 
               " [User ID: " + userId + "]";
    }
}
```

---

## 🔍 Stack Traces & Debugging

### **What is a Stack Trace?**
A **stack trace** shows the **path of method calls** that led to the exception.

### **Example Stack Trace:**
```
Exception in thread "main" java.lang.ArithmeticException: / by zero
    at Calculator.divide(Calculator.java:15)
    at MathService.calculate(MathService.java:8)
    at Main.main(Main.java:5)
```

### **Reading Stack Trace:**
```
Exception type: ArithmeticException
Message: / by zero
↓
at Calculator.divide(Calculator.java:15)  ← Exception occurred here
    ↑ Method name    ↑ File name  ↑ Line number
↓
at MathService.calculate(MathService.java:8)  ← Called by this
↓
at Main.main(Main.java:5)  ← Started from here
```

**Read from BOTTOM to TOP:**
1. Main.main called (line 5)
2. Which called MathService.calculate (line 8)
3. Which called Calculator.divide (line 15)
4. Where exception occurred!

---

### **Printing Stack Trace:**

```java
try {
    int result = 10 / 0;
} catch (ArithmeticException e) {
    
    // Method 1: Print full stack trace
    e.printStackTrace();
    
    // Method 2: Get message
    System.out.println("Message: " + e.getMessage());
    
    // Method 3: Get stack trace elements
    StackTraceElement[] stackTrace = e.getStackTrace();
    for (StackTraceElement element : stackTrace) {
        System.out.println("  at " + element);
    }
    
    // Method 4: Get cause (if any)
    Throwable cause = e.getCause();
    if (cause != null) {
        System.out.println("Caused by: " + cause);
    }
}
```

---

### **Debugging Tips:**

```java
// 1. Log exception details
try {
    // risky code
} catch (Exception e) {
    System.err.println("Error occurred:");
    System.err.println("Type: " + e.getClass().getName());
    System.err.println("Message: " + e.getMessage());
    e.printStackTrace();
}

// 2. Wrap exceptions with more context
try {
    processUser(userId);
} catch (SQLException e) {
    throw new RuntimeException("Failed to process user: " + userId, e);
    // Original exception preserved as cause
}

// 3. Use meaningful messages
throw new IllegalArgumentException(
    "User age must be between 0 and 150, got: " + age
);
```

---

## 🔧 Exception Management Patterns

### **1. Managing Exceptions Locally (Try-Catch)**
**When:** You can handle exception right here

```java
public void saveToFile(String data) {
    try {
        FileWriter fw = new FileWriter("output.txt");
        fw.write(data);
        fw.close();
    } catch (IOException e) {
        // Handle locally
        System.out.println("Error saving file: " + e.getMessage());
        // Provide default behavior
        System.out.println("Data saved to console instead:");
        System.out.println(data);
    }
}
```

---

### **2. Ducking Exceptions (throws)**
**When:** Caller is better suited to handle

```java
// Service layer - ducks exception
public User getUserById(String id) throws UserNotFoundException {
    User user = database.findUser(id);
    if (user == null) {
        throw new UserNotFoundException("User not found: " + id);
    }
    return user;
}

// Controller layer - handles exception
public void displayUser(String id) {
    try {
        User user = userService.getUserById(id);
        System.out.println("User: " + user);
    } catch (UserNotFoundException e) {
        System.out.println("Error: " + e.getMessage());
        System.out.println("Please check the user ID and try again.");
    }
}
```

---

### **3. Rethrowing Exceptions**
**When:** Log/process exception, then let caller handle

```java
public void processPayment(Payment payment) throws PaymentException {
    try {
        validatePayment(payment);
        chargeCard(payment);
        updateDatabase(payment);
    } catch (ValidationException e) {
        // Log it
        logger.error("Payment validation failed", e);
        // Rethrow as different exception
        throw new PaymentException("Payment failed validation", e);
    } catch (SQLException e) {
        // Log it
        logger.error("Database error during payment", e);
        // Rethrow with context
        throw new PaymentException("Failed to save payment", e);
    }
}
```

---

### **4. Chained Exceptions**
**Preserve full error history**

```java
try {
    dbConnection.query("SELECT * FROM users");
} catch (SQLException e) {
    // Wrap in custom exception, preserve original
    DatabaseException dbEx = new DatabaseException("Query failed");
    dbEx.initCause(e);  // Set cause
    throw dbEx;
}

// Later, you can trace back:
catch (DatabaseException e) {
    Throwable cause = e.getCause();  // Gets original SQLException
    System.out.println("Root cause: " + cause);
}
```

---

## 🎯 Real-World Example

### **Complete Banking Application:**

```java
// Custom Exceptions
class InsufficientFundsException extends Exception {
    private double shortfall;
    
    public InsufficientFundsException(String message, double shortfall) {
        super(message);
        this.shortfall = shortfall;
    }
    
    public double getShortfall() {
        return shortfall;
    }
}

class InvalidAccountException extends RuntimeException {
    public InvalidAccountException(String message) {
        super(message);
    }
}

// Bank Account Class
class BankAccount {
    private String accountNumber;
    private double balance;
    
    public void deposit(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Deposit amount must be positive");
        }
        balance += amount;
        System.out.println("Deposited: $" + amount);
    }
    
    public void withdraw(double amount) throws InsufficientFundsException {
        if (amount <= 0) {
            throw new IllegalArgumentException("Withdrawal amount must be positive");
        }
        
        if (amount > balance) {
            double shortfall = amount - balance;
            throw new InsufficientFundsException(
                "Insufficient funds. Need $" + shortfall + " more.",
                shortfall
            );
        }
        
        balance -= amount;
        System.out.println("Withdrawn: $" + amount);
    }
    
    public double getBalance() {
        return balance;
    }
}

// Banking Service
class BankingService {
    
    public void transfer(BankAccount from, BankAccount to, double amount) 
            throws InsufficientFundsException {
        try {
            from.withdraw(amount);
            to.deposit(amount);
            System.out.println("Transfer successful!");
        } catch (InsufficientFundsException e) {
            System.err.println("Transfer failed: " + e.getMessage());
            throw e;  // Rethrow to caller
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid transfer amount: " + e.getMessage());
        }
    }
}

// Main Application
public class BankApp {
    public static void main(String[] args) {
        BankAccount account1 = new BankAccount();
        BankAccount account2 = new BankAccount();
        BankingService service = new BankingService();
        
        try {
            account1.deposit(1000);
            account2.deposit(500);
            
            // This will succeed
            service.transfer(account1, account2, 200);
            
            // This will fail
            service.transfer(account1, account2, 5000);
            
        } catch (InsufficientFundsException e) {
            System.out.println("Transaction cancelled.");
            System.out.println("Shortfall: $" + e.getShortfall());
            e.printStackTrace();
        } catch (Exception e) {
            System.err.println("Unexpected error:");
            e.printStackTrace();
        } finally {
            System.out.println("\nFinal Balances:");
            System.out.println("Account 1: $" + account1.getBalance());
            System.out.println("Account 2: $" + account2.getBalance());
        }
    }
}
```

---

## 📋 Best Practices

### **✅ DO:**

1. **Catch specific exceptions first:**
```java
try {
    // code
} catch (FileNotFoundException e) {  // Specific
    // handle
} catch (IOException e) {  // More general
    // handle
}
```

2. **Always include meaningful messages:**
```java
throw new IllegalArgumentException("Age must be between 1 and 150, got: " + age);
```

3. **Close resources in finally:**
```java
FileReader fr = null;
try {
    fr = new FileReader("file.txt");
} finally {
    if (fr != null) fr.close();
}

// Or use try-with-resources (Java 7+)
try (FileReader fr = new FileReader("file.txt")) {
    // Auto-closes
}
```

4. **Log exceptions:**
```java
catch (Exception e) {
    logger.error("Error processing user", e);
}
```

5. **Document exceptions in Javadoc:**
```java
/**
 * Withdraws amount from account
 * @throws InsufficientFundsException if balance too low
 */
public void withdraw(double amount) throws InsufficientFundsException {
    // ...
}
```

---

### **❌ DON'T:**

1. **Don't catch Exception unless necessary:**
```java
// ❌ Bad - too broad
catch (Exception e) {
    // Catches everything
}

// ✅ Better
catch (IOException e) {
    // Specific
}
```

2. **Don't swallow exceptions:**
```java
// ❌ Bad - hides error
try {
    // code
} catch (Exception e) {
    // Do nothing
}

// ✅ Better
catch (Exception e) {
    logger.error("Error occurred", e);
}
```

3. **Don't use exceptions for flow control:**
```java
// ❌ Bad
try {
    while (true) {
        array[i++];  // Throws exception when done
    }
} catch (ArrayIndexOutOfBoundsException e) {
    // Done
}

// ✅ Better
for (int i = 0; i < array.length; i++) {
    array[i];
}
```

4. **Don't throw from finally:**
```java
// ❌ Bad - hides original exception
try {
    // code
} finally {
    throw new Exception();  // Original exception lost!
}
```

---

## 📊 Summary Chart

### **Exception Handling Decision Tree:**

```
Is it a problem?
    ↓
Can it be predicted/prevented?
    ↓ YES
    → Validate input, check conditions
    ↓ NO
Can you recover from it?
    ↓ YES → Checked Exception
        ↓
    Handle with try-catch
    or declare with throws
    ↓ NO → Error or RuntimeException
        ↓
    Let it crash or
    log and gracefully exit
```

---

## 🎓 Key Takeaways

1. **Throwable** is the root of all exceptions
2. **Error** = serious, don't catch
3. **Exception** = recoverable, handle it
4. **RuntimeException** = unchecked, optional handling
5. **Checked exceptions** = compile-time, must handle
6. **throw** = throw an exception
7. **throws** = declare possible exceptions
8. **try-catch-finally** = handle exceptions
9. **finally** always executes (cleanup)
10. **Custom exceptions** = domain-specific errors

---

## 🚀 Practice Examples

Try these exercises:

1. Create a `Calculator` class with divide method that throws `DivideByZeroException`
2. Create a `User` class with age validation throwing `InvalidAgeException`
3. Read a file and handle all possible IOExceptions
4. Create a stack overflow error and catch it (if you dare!)
5. Chain 3 exceptions together and print the full trace

**Happy Exception Handling! ☕**
