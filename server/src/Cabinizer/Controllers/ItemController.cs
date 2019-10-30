using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Cabinizer.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Cabinizer.Controllers
{
    [ApiController]
    [Route("items")]
    public class ItemController : ControllerBase
    {
        public ItemController(CabinizerContext context)
        {
            Context = context;
        }

        private CabinizerContext Context { get; }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyCollection<Item>>> GetAll(CancellationToken cancellationToken)
        {
            return Ok(await Context.Items.ToListAsync(cancellationToken));
        }
    }
}
