using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Cabinizer.Data;
using Cabinizer.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Cabinizer.Controllers
{
    [Route("items")]
    public class ItemController : ApiController
    {
        static ItemController()
        {
            MapToModel = item => new ItemModel
            {
                Id = item.Id,
                Name = item.Name,
            };
        }

        public ItemController(CabinizerContext context)
        {
            Context = context;
        }

        private static Expression<Func<Item, ItemModel>> MapToModel { get; }

        private CabinizerContext Context { get; }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<Item>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<Item>>> GetAllItems(CancellationToken cancellationToken)
        {
            return Ok(await Context.Items
                .AsNoTracking()
                .Where(x => EF.Functions.Like(x.OrganizationUnitPath, User.OrgUnitPath + "%"))
                .Select(MapToModel)
                .ToListAsync(cancellationToken));
        }
    }
}
