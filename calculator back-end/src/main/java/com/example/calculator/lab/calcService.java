package com.example.calculator.lab;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.Objects;

@Service
public class calcService {
    String output = "";
    public String getResult(String op1, String op2, String operator){
        double res = 0.0;
        switch(operator){
            case "+":
                res = Double.parseDouble(op1) + Double.parseDouble(op2);
                break;
            case "-":
                res = Double.parseDouble(op1) - Double.parseDouble(op2);
                break;
            case "x":
                res = Double.parseDouble(op1) * Double.parseDouble(op2);
                break;
            case "div":
                if(Objects.equals(op2,"0")){
                    return null;
                }else{
                    res = Double.parseDouble(op1) / Double.parseDouble(op2);
                }
                break;
            case "dx":
                if( Objects.equals(op1,"0") ){
                    return null;
                }else{
                    res = 1.0 / Double.parseDouble(op1);
                }
                break;
            case "sqr":
                res = Math.pow(Double.parseDouble(op1),2);
                break;
            case "root":
                double num = Double.parseDouble(op1);
                if(num >= 0.0){
                    res = Math.sqrt(num);
                }else{
                    return null;
                }
                break;
            case "percent":
                res = (Double.parseDouble(op2)/100.0) * Double.parseDouble(op1);
                break;
        }
        final double max = (2-Math.pow(2.0,-52.0))*Math.pow(2,1023);
        if(Math.abs(res) > max){
            return null;
        }
        output = String.valueOf(res);
        return output;
    }
}
