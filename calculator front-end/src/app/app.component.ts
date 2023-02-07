import { calcServer } from './app.service';
import { Expression } from '@angular/compiler';
import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'calculator';
  prev: string = "0";
  curr: string = "0";
  operator: string = "";
  experession: string = "";
  dotClicked: boolean = false;
  resetCurr: boolean = false;
  equalClicked: boolean = false;
  divideX: boolean = false;
  rootX: boolean = false;
  squareX: boolean = false;
  sc: string = "";
  fnFlag: boolean = false;
  errorFlag: boolean = false;
  max_size: number = 14;
  bin: boolean = false;
  multi: boolean = false;
  fxFlag: boolean = false;
  perFlag: boolean = false;


  constructor(private calcObj: calcServer) { };

  public sendExpression(op1: string, op2: string, operator: string): void {
    this.calcObj.evaluateOp(op1, op2, operator).subscribe({
      next: (x) => {
        if (x == null) {
          this.errorFlag = true;
          if (operator == "div" || operator == "dx") {
            this.curr = "Cannot divide by zero";
          } else if (operator == "root") {
            this.curr = "Invalid input";
          } else {
            this.curr = "Overflow";
          }
          this.prev = "";
          this.operator = "";
        } else {
          this.curr = x;
          this.prev = x;
          this.sc = x;

        }
      }
      ,
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    })
  }

  public sendAnotherExpression(op1: string, op2: string, operator: string, prevOp: string): void {
    this.calcObj.evaluateOp(op1, op2, operator).subscribe({
      next: (x) => {
        if (x == null) {
          this.errorFlag = true;
          if (operator == "div" || operator == "dx") {
            this.curr = "Cannot divide by zero";
          } else if (operator == "root") {
            this.curr = "Invalid input";
          } else {
            this.curr = "Overflow";
          }
          this.prev = "";
          this.operator = "";
        } else {
          if (prevOp == "+") {
            this.curr = (Number(this.prev) + Number(x)).toString();
          } else if (prevOp == "-") {
            this.curr = (Number(this.prev) - Number(x)).toString();
          } else if (prevOp == "x") {
            this.curr = (Number(this.prev) * Number(x)).toString();
          } else if (prevOp == "div") {
            this.curr = (Number(this.prev) / Number(x)).toString();
          }
          this.prev = this.curr;
          this.sc = this.curr;
        }
      }
      ,
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    })
  }

  nested: boolean = false;
  public sendNested(op1: string, op2: string, prevOperator: string, currOperator: string): void {
    this.calcObj.evaluateOp(op1, op2, prevOperator).subscribe({
      next: (x) => {
        if (x == null) {
          this.errorFlag = true;
          if (prevOperator == "div" || prevOperator == "dx") {
            this.curr = "Cannot divide by zero";
          } else if (prevOperator == "root") {
            this.curr = "Invalid input";
          } else {
            this.curr = "Overflow";
          }
          this.prev = "";
          this.operator = "";
        } else {
          this.curr = x;
          this.nested = true;
          this.prev = x;
          this.operator = currOperator;
          this.experession = this.prev + " " + this.operator;
        }

      }
      ,
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    })
  }


  clear_all() {
    this.curr = "0";
    this.prev = "";
    this.operator = "";
    this.experession = this.prev + this.operator;
    this.dotClicked = false;
    this.equalClicked = false;
    this.divideX = false;
    this.rootX = false;
    this.squareX = false;
    this.fnFlag = false;
    this.errorFlag = false;
    this.bin = false;
    this.nested = false;
    this.fxFlag = false;
    this.perFlag = false;
  }

  del() {
    if (this.errorFlag) {
      this.clear_all();
      return;
    }
    if (!this.equalClicked && !this.perFlag && !this.fxFlag) {
      if (this.curr.length > 1) {
        if (this.curr.charAt(this.curr.length - 1) == '.') {
          this.dotClicked = false;
        }
        this.curr = this.curr.substring(0, this.curr.length - 1);

      } else {
        this.curr = "0";
      }
    }

  }

  done: boolean = false;
  unary_operator(unary_op: string) {
    this.dotClicked = false;
    if (this.errorFlag) {
      this.clear_all();
      return;
    }
    this.resetCurr = true;
    if (unary_op == 'neg') {
      this.fnFlag = true;
      if (this.divideX || this.rootX || this.squareX) {
        this.experession = "negate(" + this.experession + ")";
      } else if (this.bin) {
        this.experession += " " + "negate(" + this.curr + ")";
      }
      else {
        this.experession = "negate(" + this.curr + ")";
      }
      this.divideX = false;
      this.squareX = false;
      this.rootX = false;

      this.curr = (-1 * Number(this.curr)).toString();
    } else if (unary_op == "%") {
      this.perFlag = true;
      this.operator = "upercent";
      if (!this.bin) {
        this.sendExpression("0", this.curr, "percent");
      } else {
        this.sendExpression(this.prev, this.curr, "percent");
      }
    }
  }

  binPrevOp: string = "";
  binary_operator(op: string) {
    this.binPrevOp = this.operator;
    this.bin = true;
    if (this.errorFlag) {
      this.clear_all();
      return;
    }
    this.operator = op;
    if (this.multi) {
      this.binPrevOp = this.operator;


    } else if (this.binPrevOp == "+" || this.binPrevOp == "-" || this.binPrevOp == "x" || this.binPrevOp == "div") {
      if (!this.nested) {
        this.sendNested(this.prev, this.curr, this.binPrevOp, this.operator);
      }
    }
    this.prev = this.curr;
    this.experession = this.prev + " " + this.operator;
    if (this.curr.charAt(this.curr.length - 1) == '.') {
      this.curr = this.curr.substring(0, this.curr.length - 1);
      this.dotClicked = false;
    }
    this.resetCurr = true;
    this.done = false;
    this.divideX = false;
    this.squareX = false;
    this.rootX = false;
    this.dotClicked = false;
    this.multi = true;
  }

  xPrev: string = "";
  x_function(fn: string) {
    this.bin = false;
    this.fxFlag = true;

    if (this.errorFlag) {
      this.clear_all();
      return;
    }
    this.dotClicked = false;
    this.resetCurr = true;
    this.xPrev = this.operator;
    if (fn == '1/x') {
      this.fnFlag = true;
      this.done = false;
      this.operator = "dx"
      if (!this.rootX && !this.squareX && !this.divideX) {
        if (this.experession.charAt(this.experession.length - 1) != '=' && this.experession.charAt(this.experession.length - 1) != ')') {
          this.experession += " " + "1/(" + this.curr + ")";
        } else {
          this.experession = "1/(" + this.curr + ")";
        }
        this.divideX = true;
      } else {
        this.experession = "1/(" + this.experession + ")";
      }
    } else if (fn == "x2") {
      this.fnFlag = true;
      this.done = false;
      this.operator = "sqr"
      if (!this.rootX && !this.squareX && !this.divideX) {
        if (this.experession.charAt(this.experession.length - 1) != '=' && this.experession.charAt(this.experession.length - 1) != ')') {
          this.experession += " " + "sqr(" + this.curr + ")"
        } else {
          this.experession = "sqr(" + this.curr + ")"
        }
        this.squareX = true;
      } else {
        this.experession = "sqr(" + this.experession + ")";
      }

    } else if (fn == "xr") {
      this.fnFlag = true;
      this.done = false;
      this.operator = "root"
      if (!this.rootX && !this.squareX && !this.divideX) {

        if (this.experession.charAt(this.experession.length - 1) != '=' && this.experession.charAt(this.experession.length - 1) != ')') {
          this.experession += " " + "√(" + this.curr + ")";
        } else {
          this.experession = "√(" + this.curr + ")";
        }
        this.rootX = true;
      }
      else {
        this.experession = "√(" + this.experession + ")";
      }

    }
    if (this.xPrev == "+" || this.xPrev == "-" || this.xPrev == "x" || this.xPrev == "div") {
      this.sendAnotherExpression(this.curr, "ux", this.operator, this.xPrev);
    } else {
      this.sendExpression(this.curr, "ux", this.operator);
    }

  }
  
  clickNumber(number: string) {

    if (this.errorFlag) {
      this.clear_all();
      return;
    }
    if (number == '.' && !this.dotClicked) {
      this.dotClicked = true;

      if (this.resetCurr || this.nested) {
        this.curr = "0";
        this.resetCurr = false;
      }
      this.curr += number;


    } else if (number != '.') {
      if (this.curr == "0") {
        this.curr = number;
        this.resetCurr = false;
      } else {
        if (this.resetCurr || this.nested) {
          this.curr = "";
          this.resetCurr = false;
        }
        if (this.curr.length < this.max_size) {
          this.curr += number;
        }
      }
    }
    this.equalClicked = false;
    this.divideX = false;
    this.squareX = false;
    this.rootX = false;
    this.fnFlag = false;
    this.done = false;
    this.nested = false;
    this.multi = false;
    this.perFlag = false;
    this.fxFlag = false;
  }

  prevOp: string = "";
  equal_operator() {
    this.dotClicked = false;
    this.bin = false;
    if (this.errorFlag) {
      this.clear_all();
      return;
    }
    if (!this.equalClicked) {
      this.prevOp = this.operator;
      if (this.curr.charAt(this.curr.length - 1) == '.') {
        this.curr = this.curr.substring(0, this.curr.length - 1);
        this.dotClicked = false;
      }
      if ((this.operator == "upercent" || this.operator == "dx" || this.operator == "sqr" || this.operator == "root") && !this.fnFlag) {
        this.prev = this.curr;
        this.experession = this.prev + " " + "=";
      } else {
        if (this.prev == "" || this.operator == '=') {
          this.operator = "=";
          this.prev = this.curr;
        } else {
          this.operator = "=";
        }

        if (this.prevOp == "=" || this.prevOp == "") {
          this.experession = this.curr + " " + '=';
        }
        else if (!this.divideX && !this.rootX && !this.squareX && !this.fnFlag) {
          this.experession += " " + this.curr + " " + '=';
        }
        this.divideX = false;
        this.squareX = false;
        this.rootX = false;
        this.equalClicked = true;
        this.resetCurr = true;
        if (!this.done && this.prevOp != "=" && this.prevOp != "") {
          this.sendExpression(this.prev, this.curr, this.prevOp);
        }
      }
    }
  }
}
