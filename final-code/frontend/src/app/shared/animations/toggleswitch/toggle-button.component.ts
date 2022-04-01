import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'toggle-button',
  template: `
    <input
      type="checkbox"
      id="toggle-button-checkbox"
      (change)="changed.emit($event.target.checked)"
    checked />
    <label class="toggle-button-switch" for="toggle-button-checkbox"></label>
    <div class="toggle-button-text">
    <div class="toggle-button-text-on">Active</div>
    <div class="toggle-button-text-off">Inactive</div>     
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        position: relative;
        width: 126px;
        height: 50px;
      }

      input[type='checkbox'] {
        display: none;
      }

      .toggle-button-switch {
        position: absolute;
        top: 5px;
        left: 10px;
        width: 53px;
        height: 25px;
        background-color: #fff;
        border-radius: 15%;
        cursor: pointer;
        z-index: 100;
        transition: left 0.3s;
      }

      .toggle-button-text {
        overflow: hidden;
        background-color: #fc3164;       
        border-radius: 25px;
        box-shadow: 2px 2px 5px 0 rgba(50, 50, 50, 0.75);
        transition: background-color 0.3s;
      }

      .toggle-button-text-on,
      .toggle-button-text-off {
        float: left;
        width: 50%;
        height: 100%;
        line-height: 35px;
        font-family: Lato, sans-serif;
        font-weight: bold;
        color: #fff;
        font-size:12px;
        text-align: center;
      }

      input[type='checkbox']:checked ~ .toggle-button-switch {
        left: 67px;
      }

      input[type='checkbox']:checked ~ .toggle-button-text {        
        background-color: #3dbf87;
      }
    `
  ]
})
export class ToggleButtonComponent {
  @Output() changed = new EventEmitter<boolean>();
}
