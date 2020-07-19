import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { ActivatedRoute, Router, ROUTES } from '@angular/router'
import { ScullyContentComponent, ScullyRoutesService } from '@scullyio/ng-lib'
import { zip, combineLatest } from 'rxjs'
import { filter, map } from 'rxjs/operators'


@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  preserveWhitespaces: true,
  encapsulation: ViewEncapsulation.Emulated

})
export class BlogComponent implements OnInit {
  $blogPosts = combineLatest([
    this.routerService.available$,
    this.route.params,
  ])
    .pipe(
      map(([routes, params]) =>
        routes.filter(
          route =>
            route.route.startsWith('/blog/') && route.sourceFile.endsWith('.md')
            && `${route.lang}` === `${params.lang}`
        )
          .reduce((menus, curr) => {
            const idx = menus.findIndex(({ menu }) => menu === curr.menu)
            if (idx === -1) {
              menus.push({
                menu: curr.menu,
                routes: [curr]
              })
            } else {
              menus[idx].routes.push(curr)
            }
            return menus
          }, [])
      )
    )

  $activeRoute = combineLatest([
    this.routerService.available$,
    this.route.params,
  ])
  .pipe(
    map(([routes, {slug}]) => routes.filter(route => route.route.indexOf(slug) !== -1) ),
    map(([activeRoute]) => activeRoute)
  )

  ngOnInit() { }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public routerService: ScullyRoutesService,
  ) {
  }
}
