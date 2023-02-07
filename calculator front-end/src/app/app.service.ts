import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";


@Injectable({
    providedIn: 'root'
})
export class calcServer{
    constructor(private http: HttpClient){}

    public evaluateOp(op1: string, op2: string, operator: string): Observable<string>{
        return this.http.post<string>(`http://localhost:8082/evaluate/${op1}/${op2}/${operator}`, JSON);
    }
    
}