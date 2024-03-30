import { Context } from '@koishijs/client'
import Page from './page.vue'
import "./output.css"

export default (ctx: Context) => {
  ctx.page({
    name: 'API测试',
    path: '/custom-page',
    component: Page,
  })
}