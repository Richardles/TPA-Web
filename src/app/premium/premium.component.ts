import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-premium',
  templateUrl: './premium.component.html',
  styleUrls: ['./premium.component.scss']
})
export class PremiumComponent implements OnInit {

  plan
  price

  constructor() { }

  ngOnInit(): void {
    this.plan = "monthly"
    this.price = "59,000"
  }

  setPlan(plan){
    this.plan = plan
    if(plan == "monthly"){
      this.price = "59,000"
    }else{
      this.price = "659,000"
    }
  }

}
