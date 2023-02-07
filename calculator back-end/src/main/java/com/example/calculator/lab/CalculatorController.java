package com.example.calculator.lab;
import org.springframework.web.bind.annotation.*;


@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class CalculatorController  {
    @PostMapping(value = "/evaluate/{op1}/{op2}/{operator}")

    public String handler(@PathVariable("op1") String op1, @PathVariable("op2") String op2, @PathVariable("operator") String operator ) {
        final calcService calc = new calcService();
        return calc.getResult(op1, op2, operator);
    }
}
