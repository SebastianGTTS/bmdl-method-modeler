import { Component } from '@angular/core';

class NavItem {
  name: string;
  route?: string[];
}

class RootNavItem extends NavItem {
  submenu?: NavItem[];
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  navItems: RootNavItem[] = [
    {name: 'Methods', route: ['bmprocess']},
    {name: 'Patterns', route: ['process']},
    {name: 'Building Blocks', route: ['methods']},
    {
      name: 'Method Elements', submenu: [
        {name: 'Artifacts', route: ['artifacts']},
        {name: 'Situational Factors', route: ['situationalFactors']},
        {name: 'Stakeholders', route: ['stakeholders']},
        {name: 'Tools', route: ['tools']},
        {name: 'Types', route: ['types']},
      ],
    },
    {name: 'Explanation', route: ['explanation']},
    {name: 'Options', route: ['options']},
  ];
  navExpanded = false;

}
