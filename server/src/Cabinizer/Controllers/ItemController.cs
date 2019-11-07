using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Cabinizer.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Cabinizer.Controllers
{
    [Route("items")]
    public class ItemController : ApiController
    {
        public ItemController(CabinizerContext context)
        {
            Context = context;
        }

        private CabinizerContext Context { get; }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<Cabin>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<Cabin>>> GetAllItems(CancellationToken cancellationToken)
        {
            return Ok(await Context.Cabins.Where(x => User.OrganizationUnitId.StartsWith(x.OrganizationUnitId)).ToListAsync(cancellationToken));
        }
    }
}
