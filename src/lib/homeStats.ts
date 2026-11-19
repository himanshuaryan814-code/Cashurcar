export type HomeStatistic={value:string;title:string;description:string};
export type HomeStatsContent={items:HomeStatistic[]};

export const defaultHomeStats:HomeStatsContent={
  items:[
    {value:'150+',title:'Quality Checks',description:'Every vehicle goes through a detailed inspection process.'},
    {value:'20+',title:'Years of Experience',description:'Experience and knowledge you can trust.'},
    {value:'RC',title:'Transfer Assistance',description:'Support with ownership transfer and documentation.'},
    {value:'100%',title:'Transparent Pricing',description:'Clear vehicle pricing and straightforward conversations.'},
    {value:'Drive',title:'Test Drive',description:'Experience your preferred vehicle before deciding.'},
    {value:'Care',title:'Quality Focus',description:'Careful evaluation of pre-owned vehicle listings.'},
    {value:'1000+',title:'Successful Deliveries',description:'Helping customers drive home their preferred vehicles.'},
    {value:'1000+',title:'Happy Customers',description:'Building relationships that go beyond the sale.'},
    {value:'Pan India',title:'Pan India Delivery',description:'Get your preferred car delivered to your doorstep across India.'},
    {value:'Easy Finance',title:'Easy Finance',description:'Flexible financing options to make your car purchase easier.'}
  ]
};

export function parseHomeStats(value:unknown):HomeStatsContent|null{
  if(!value||typeof value!=='object')return null;
  const content=value as {items?:unknown};
  if(!Array.isArray(content.items)||(content.items.length!==8&&content.items.length!==10))return null;
  const items:HomeStatistic[]=[];
  for(const item of content.items){
    if(!item||typeof item!=='object')return null;
    const statistic=item as Record<string,unknown>;
    if(typeof statistic.value!=='string'||!statistic.value.trim()||typeof statistic.title!=='string'||!statistic.title.trim()||typeof statistic.description!=='string'||!statistic.description.trim())return null;
    items.push({value:statistic.value,title:statistic.title,description:statistic.description});
  }
  return{items:items.length===8?[...items,...defaultHomeStats.items.slice(8)]:items};
}
