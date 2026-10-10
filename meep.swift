var couponCode: String? = "SAVE20" // The '?' means it can be a String or nil
couponCode = nil                   // Perfectly valid

var standardCode: String? = "FALL25"

// Safely unwrapping using "if let"
if let activeCode = standardCode {
    print("Success! Your coupon code is: \(activeCode)")
} else {
    print("No discount code applied.")
}

// Nil-coalescing operator (??) provides a fallback default value
let finalCode = couponCode ?? "NO_DISCOUNT"
print("Applied code: \(finalCode)") // Output: Applied code: NO_DISCOUNT
